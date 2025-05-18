use rocket::fs::{FileServer, relative};
use rocket_dyn_templates::{Template, context};
use rocket::response::Redirect;
use rocket::form::Form;
use rocket::State;
use chrono::{DateTime, NaiveDateTime, Utc, Duration};
use serde::{Serialize, Deserialize};
use std::sync::Mutex;

// Struct to hold form data
#[derive(FromForm)]
struct BirthdayInput {
    date: String,
    time: String,
}

#[derive(Serialize, Deserialize)]
struct MillionSecondBirthday {
    original_date: String,
    million_second_date: DateTime<Utc>,
}

// Main route
#[get("/")]
fn index() -> Template {
    Template::render("index", context! {})
}

// Calculate million second birthday
#[post("/calculate", data = "<input>")]
fn calculate(input: Form<BirthdayInput>) -> Template {
    // Parse input date and time
    let date_time_str = format!("{} {}", input.date, input.time);
    
    // For simplicity, assuming date format is YYYY-MM-DD and time format is HH:MM
    let naive_dt = NaiveDateTime::parse_from_str(&date_time_str, "%Y-%m-%d %H:%M")
        .unwrap_or_else(|_| Utc::now().naive_utc());
    
    // Convert to UTC DateTime
    let birth_dt = DateTime::<Utc>::from_utc(naive_dt, Utc);
    
    // Add 1 million seconds to get million second birthday
    let million_seconds = Duration::seconds(1_000_000);
    let million_second_birthday = birth_dt + million_seconds;
    
    Template::render("result", context! {
        original_date: date_time_str,
        million_second_date: million_second_birthday.format("%Y-%m-%d %H:%M:%S").to_string(),
    })
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index, calculate])
        .mount("/static", FileServer::from(relative!("static")))
        .attach(Template::fairing())
}
