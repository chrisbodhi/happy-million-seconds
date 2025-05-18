use chrono::{Duration, TimeZone, Utc};
use chrono_tz::Tz;
use wasm_bindgen::prelude::*;
use serde_wasm_bindgen;

#[wasm_bindgen]
pub struct SecondsDiff {
    million: i64,
    billion: i64,
    trillion: i64,
}

#[wasm_bindgen]
impl SecondsDiff {
    #[wasm_bindgen(getter)]
    pub fn million(&self) -> i64 {
        self.million
    }

    #[wasm_bindgen(getter)]
    pub fn billion(&self) -> i64 {
        self.billion
    }

    #[wasm_bindgen(getter)]
    pub fn trillion(&self) -> i64 {
        self.trillion
    }
}

#[wasm_bindgen]
pub fn calculate_seconds_diff(
    birth_date: &str,
    birth_time: &str,
    birth_timezone: &str,
    current_date: &str,
    current_time: &str,
    current_timezone: &str,
) -> Result<SecondsDiff, JsValue> {
    // Parse timezones
    let birth_tz: Tz = birth_timezone
        .parse()
        .map_err(|_| JsValue::from_str(&format!("Invalid birth timezone: {}", birth_timezone)))?;

    let current_tz: Tz = current_timezone.parse().map_err(|_| {
        JsValue::from_str(&format!("Invalid current timezone: {}", current_timezone))
    })?;

    // Parse birth datetime
    let birth_datetime_str = format!("{} {}", birth_date, birth_time);
    let naive_datetime = chrono::NaiveDateTime::parse_from_str(&birth_datetime_str, "%Y-%m-%d %H:%M")
        .map_err(|e| JsValue::from_str(&format!("Error parsing birth datetime: {}", e)))?;
    let birth_datetime = birth_tz.from_local_datetime(&naive_datetime)
        .single()
        .ok_or_else(|| JsValue::from_str("Ambiguous or invalid birth datetime"))?;

    // Parse current datetime
    let current_datetime_str = format!("{} {}", current_date, current_time);
    let naive_datetime = chrono::NaiveDateTime::parse_from_str(&current_datetime_str, "%Y-%m-%d %H:%M")
        .map_err(|e| JsValue::from_str(&format!("Error parsing current datetime: {}", e)))?;
    let current_datetime = current_tz.from_local_datetime(&naive_datetime)
        .single()
        .ok_or_else(|| JsValue::from_str("Ambiguous or invalid current datetime"))?;

    // Convert both to UTC for comparison
    let birth_utc = birth_datetime.with_timezone(&Utc);
    let current_utc = current_datetime.with_timezone(&Utc);

    // Calculate elapsed seconds
    let elapsed_seconds = (current_utc - birth_utc).num_seconds();

    // Calculate differences for milestones
    let million_seconds = 1_000_000;
    let billion_seconds = 1_000_000_000;
    let trillion_seconds = 1_000_000_000_000;

    // Calculate seconds remaining or elapsed
    let million_diff = million_seconds - elapsed_seconds;
    let billion_diff = billion_seconds - elapsed_seconds;
    let trillion_diff = trillion_seconds - elapsed_seconds;

    Ok(SecondsDiff {
        million: million_diff,
        billion: billion_diff,
        trillion: trillion_diff,
    })
}

#[wasm_bindgen]
pub fn format_milestone_date(
    birth_date: &str,
    birth_time: &str,
    birth_timezone: &str,
    seconds_to_add: i64,
    output_timezone: &str,
) -> Result<String, JsValue> {
    // Parse timezones
    let birth_tz: Tz = birth_timezone
        .parse()
        .map_err(|_| JsValue::from_str(&format!("Invalid birth timezone: {}", birth_timezone)))?;

    let output_tz: Tz = output_timezone
        .parse()
        .map_err(|_| JsValue::from_str(&format!("Invalid output timezone: {}", output_timezone)))?;

    // Parse birth datetime
    let birth_datetime_str = format!("{} {}", birth_date, birth_time);
    let naive_datetime = chrono::NaiveDateTime::parse_from_str(&birth_datetime_str, "%Y-%m-%d %H:%M")
        .map_err(|e| JsValue::from_str(&format!("Error parsing birth datetime: {}", e)))?;
    let birth_datetime = birth_tz.from_local_datetime(&naive_datetime)
        .single()
        .ok_or_else(|| JsValue::from_str("Ambiguous or invalid birth datetime"))?;

    // Convert to UTC, add seconds, and convert to output timezone
    let birth_utc = birth_datetime.with_timezone(&Utc);
    let milestone_utc = birth_utc + Duration::seconds(seconds_to_add);
    let milestone_local = milestone_utc.with_timezone(&output_tz);

    // Format the result
    let formatted_date = milestone_local.format("%Y-%m-%d %H:%M:%S %Z").to_string();

    Ok(formatted_date)
}

// Helper function to get list of all timezones - useful for UI dropdowns
#[wasm_bindgen]
pub fn get_all_timezones() -> JsValue {
    let timezones = chrono_tz::TZ_VARIANTS
        .iter()
        .map(|tz| tz.name())
        .collect::<Vec<&str>>();

    serde_wasm_bindgen::to_value(&timezones).unwrap()
}
