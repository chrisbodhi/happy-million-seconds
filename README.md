# Happy Million Seconds Club

A web application to celebrate your millionth second birthday, rewritten in Rust!

## Original Website
http://www.happymillionseconds.club/

## About

This is a Rust rewrite of the Happy Million Seconds Club website. A million seconds is approximately 11.6 days, and this application calculates exactly when your millionth second birthday occurs.

## Features

- Calculate your millionth second birthday based on your birth date and time
- Responsive web design
- Social media sharing capabilities

## Technology Stack

- [Rust](https://www.rust-lang.org/) - The programming language
- [Rocket](https://rocket.rs/) - Web framework for Rust
- [Handlebars templates](https://handlebarsjs.com/) - Templating system
- [Chrono](https://docs.rs/chrono/) - Date and time library for Rust

## Development Setup

### Prerequisites

- Rust and Cargo (install via [rustup](https://rustup.rs/))

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/chrisbodhi/happy-million-seconds.git
   cd happy-million-seconds
   git checkout rust-rewrite
   ```

2. Build and run the application:
   ```
   cargo run
   ```

3. Open your browser and navigate to `http://localhost:8000`

## How It Works

The application:
1. Takes a birth date and time as input
2. Calculates the exact moment that is 1,000,000 seconds after the birth time
3. Displays the result in a user-friendly format

## Deployment

This application can be deployed to any service that supports Rust applications, such as:
- Heroku (with a Rust buildpack)
- AWS Lambda (using Rust Lambda Runtime)
- Docker (using a Rust base image)

## License

[MIT](LICENSE)
