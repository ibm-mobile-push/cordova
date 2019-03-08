package com.skwas.cordova.datetimepicker;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DatePickerDialog.OnDateSetListener;
import android.app.Dialog;
import android.app.TimePickerDialog.OnTimeSetListener;
import android.content.DialogInterface;
import android.support.annotation.NonNull;
import android.text.TextUtils;
import android.util.Log;
import android.widget.DatePicker;
import android.widget.TimePicker;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateTimePicker extends CordovaPlugin {

	/**
	 * Options for date picker.
	 * Note that not all options are supported, they are here to match the options across all platforms.
	 */
	private class DateTimePickerOptions {
		@NonNull
		public String mode = MODE_DATE;
		public Date date = new Date();
		public long minDate = 0;
		public long maxDate = 0;
		public boolean allowOldDates = true;
		public boolean allowFutureDates = true;
		public int minuteInterval = 1;
		public String locale = "EN";
		public String okText = null;
		public String cancelText = null;

		// Android specific
		public int theme = android.R.style.Theme_DeviceDefault_Dialog;
		public boolean calendar = false;
		public boolean is24HourView = true;

		public DateTimePickerOptions() {
		}

		public DateTimePickerOptions(JSONObject obj) throws JSONException {
			this();

			mode = obj.optString("mode", mode);

			date = new Date(obj.getLong("ticks"));
			minDate = obj.optLong("minDate", minDate);
			maxDate = obj.optLong("maxDate", maxDate);
			minuteInterval = obj.optInt("minuteInterval", minuteInterval);

			allowOldDates = obj.optBoolean("allowOldDates", allowOldDates);
			allowFutureDates = obj.optBoolean("allowFutureDates", allowFutureDates);

			if (!obj.isNull("okText")) {
				okText = obj.optString("okText");
			}
			okText = TextUtils.isEmpty(okText) ? _activity.getString(android.R.string.ok) : okText;

			if (!obj.isNull("cancelText")) {
				cancelText = obj.optString("cancelText");
			}
			cancelText = TextUtils.isEmpty(cancelText) ? _activity.getString(android.R.string.cancel) : cancelText;

			JSONObject androidOptions = obj.optJSONObject("android");
			if (androidOptions != null) {
				theme = androidOptions.optInt("theme", theme);
				calendar = androidOptions.optBoolean("calendar", calendar);
				is24HourView = androidOptions.optBoolean("is24HourView", is24HourView);
			}
		}
	}

	private static final String MODE_DATE = "date";
	private static final String MODE_TIME = "time";
	private static final String MODE_DATETIME = "datetime";
	private static final String TAG = "DateTimePicker";

	private Activity _activity;
	private volatile Runnable _runnable;
	private volatile Dialog _dialog;

	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);

		_activity = cordova.getActivity();
	}

	@Override
	public synchronized boolean execute(String action, JSONArray args, final CallbackContext callbackContext) {
		Log.d(TAG, "DateTimePicker called with options: " + args);

		switch (action) {
			case "show":
				show(args, callbackContext);
				return true;
			case "hide":
				hide(args, callbackContext);
				return true;
			default:
				return false;
		}
	}

	/**
	 * Plugin 'show' method.
	 *
	 * @param data            The JSON arguments passed to the method.
	 * @param callbackContext The callback context.
	 * @return true when the dialog is shown
	 */
	public synchronized boolean show(final JSONArray data, final CallbackContext callbackContext) {
		if (_runnable != null) {
			callbackContext.sendPluginResult(
					new PluginResult(
							PluginResult.Status.ILLEGAL_ACCESS_EXCEPTION,
							"A date/time picker dialog is already showing."
					)
			);
			return false;
		}

		final DateTimePicker datePickerPlugin = this;
		final DateTimePickerOptions options;

		// Parse options from data parameter.
		if (data.length() == 1) {
			try {
				options = new DateTimePickerOptions(data.getJSONObject(0));
			} catch (JSONException ex) {
				callbackContext.error("Failed to load JSON options. " + ex.getMessage());
				return false;
			}
		} else {
			// Defaults.
			options = new DateTimePickerOptions();
		}

		// Set calendar.
		final Calendar calendar = GregorianCalendar.getInstance();
		calendar.setTime(options.date);

		if (MODE_TIME.equalsIgnoreCase(options.mode)) {
			_runnable = showTimeDialog(datePickerPlugin, callbackContext, options, calendar);
		} else if (MODE_DATE.equalsIgnoreCase(options.mode) || MODE_DATETIME.equalsIgnoreCase(options.mode)) {
			_runnable = showDateDialog(datePickerPlugin, callbackContext, options, calendar);
		} else {
			callbackContext.error("Unknown mode. Only 'date', 'time' and 'datetime' are valid modes.");
			return false;
		}

		_activity.runOnUiThread(_runnable);
		return true;
	}

	/**
	 * Plugin 'hide' method.
	 *
	 * @param data            The JSON arguments passed to the method.
	 * @param callbackContext The callback context.
	 * @return always returns true.
	 */
	public synchronized boolean hide(final JSONArray data, final CallbackContext callbackContext) {
		if (_runnable != null && _dialog != null) {
			_dialog.cancel();
			_dialog = null;
		}

		callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.NO_RESULT));
		return true;
	}

	private Runnable showTimeDialog(final DateTimePicker datePickerPlugin, final CallbackContext callbackContext, final DateTimePickerOptions options, final Calendar calendar) {
		return new Runnable() {
			@Override
			public void run() {
				final TimeSetListener timeSetListener = new TimeSetListener(datePickerPlugin, callbackContext, options, calendar);
				final TimePickerDialog timeDialog = new TimePickerDialog(
						_activity,
						options.theme,
						timeSetListener,
						calendar.get(Calendar.HOUR_OF_DAY),
						calendar.get(Calendar.MINUTE),
						options.is24HourView,
						options.minuteInterval
				);

				timeDialog.setOkText(options.okText);
				timeDialog.setCancelText(options.cancelText);

				showDialog(timeDialog, callbackContext);
			}
		};
	}

	private Runnable showDateDialog(final DateTimePicker datePickerPlugin, final CallbackContext callbackContext, final DateTimePickerOptions options, final Calendar calendar) {
		return new Runnable() {
			@Override
			public void run() {
				final DateSetListener dateSetListener = new DateSetListener(datePickerPlugin, callbackContext, options, calendar);
				final DatePickerDialog dateDialog = new DatePickerDialog(
						_activity,
						options.theme,
						dateSetListener,
						calendar.get(Calendar.YEAR),
						calendar.get(Calendar.MONTH),
						calendar.get(Calendar.DAY_OF_MONTH)
				);

				dateDialog.setOkText(options.okText);
				dateDialog.setCancelText(options.cancelText);
				dateDialog.setCalendarEnabled(options.calendar);

				DatePicker dp = dateDialog.getDatePicker();
				if (options.minDate > 0) {
					dp.setMinDate(options.minDate);
				}
				if (options.maxDate > 0 && options.maxDate > options.minDate) {
					dp.setMaxDate(options.maxDate);
				}

				showDialog(dateDialog, callbackContext);
			}
		};
	}

	/**
	 * Show the picker dialog.
	 *
	 * @param dialog          The dialog to show.
	 * @param callbackContext The callback context.
	 */
	private synchronized void showDialog(final AlertDialog dialog, final CallbackContext callbackContext) {
		dialog.setCancelable(true);
		dialog.setCanceledOnTouchOutside(false);

		dialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
			@Override
			public void onCancel(DialogInterface dialog) {
				try {
					JSONObject result = new JSONObject();
					result.put("cancelled", true);
					callbackContext.success(result);
				} catch (JSONException ex) {
					callbackContext.error("Failed to cancel.");
				} finally {
					_runnable = null;
				}
			}
		});

		_dialog = dialog;
		dialog.show();
	}

	/**
	 * Success callback for when a new date or time is set.
	 *
	 * @param calendar        The calendar with the new date and/or time.
	 * @param callbackContext The callback context.
	 */
	private synchronized void onCalendarSet(Calendar calendar, CallbackContext callbackContext) {
		try {
			JSONObject result = new JSONObject();
			Date date = calendar.getTime();
			// Due to lack of browser/user agent support for ISO 8601 parsing, we provide ticks since epoch.
			// The Javascript date constructor works far more reliably this way, even on old JS engines.
			result.put("ticks", date.getTime());
			result.put("cancelled", false);
			callbackContext.success(result);
		} catch (JSONException ex) {
			callbackContext.error("Failed to serialize date. " + calendar.getTime().toString());
		} finally {
			_runnable = null;
		}
	}

	/**
	 * Listener for the date dialog.
	 */
	private final class DateSetListener implements OnDateSetListener {
		private final DateTimePicker mDatePickerPlugin;
		private final CallbackContext mCallbackContext;
		private final DateTimePickerOptions mOptions;
		private final Calendar mCalendar;

		private DateSetListener(DateTimePicker datePickerPlugin, CallbackContext callbackContext, DateTimePickerOptions options, Calendar calendar) {
			mDatePickerPlugin = datePickerPlugin;
			mCallbackContext = callbackContext;
			mCalendar = calendar;
			mOptions = options;
		}

		@Override
		public void onDateSet(final DatePicker view, final int year, final int monthOfYear, final int dayOfMonth) {
			mCalendar.set(Calendar.YEAR, year);
			mCalendar.set(Calendar.MONTH, monthOfYear);
			mCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);

			if (MODE_DATETIME.equalsIgnoreCase(mOptions.mode)) {
				synchronized (mDatePickerPlugin) {
					_activity.runOnUiThread(
							_runnable = showTimeDialog(mDatePickerPlugin, mCallbackContext, mOptions, mCalendar)
					);
				}
			} else {
				onCalendarSet(mCalendar, mCallbackContext);
			}
		}
	}

	/**
	 * Listener for the time dialog.
	 */
	private final class TimeSetListener implements OnTimeSetListener {
		private final DateTimePicker mDatePickerPlugin;
		private final CallbackContext mCallbackContext;
		private final DateTimePickerOptions mOptions;
		private final Calendar mCalendar;

		private TimeSetListener(DateTimePicker datePickerPlugin, CallbackContext callbackContext, DateTimePickerOptions options, Calendar calendar) {
			mDatePickerPlugin = datePickerPlugin;
			mCallbackContext = callbackContext;
			mOptions = options;
			mCalendar = calendar;
		}

		@Override
		public void onTimeSet(final TimePicker view, final int hourOfDay, final int minute) {
			mCalendar.set(Calendar.HOUR_OF_DAY, hourOfDay);
			mCalendar.set(Calendar.MINUTE, minute);
			mCalendar.set(Calendar.SECOND, 0);
			mCalendar.set(Calendar.MILLISECOND, 0);

			onCalendarSet(mCalendar, mCallbackContext);
		}
	}
}
