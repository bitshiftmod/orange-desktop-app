# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2024-11-13

### Added

* New "On Mine" settings for determining action to take after successfully mining and ORA. Includes option to HODL or Add to LP with Algo, VEST, or COOP. Add to LP option swaps Algo to VEST or COOP before adding with ORA to LP. 

### Updated

* Reworked mining process to use Rust thread as using setInterval could get throttled when app was in background. 

## [0.3.0] - 2024-10-31

### Added

* New Linux Desktop build: App runs as a standard desktop app due to Tauri limitations with system tray on Linux. Functionality is otherwise the same as the system tray version on other OS's. 


## [0.2.0] - 2024-10-30

### Updated

* Node settings: Server is now an editable field to allow for connecting to nodes other than localhost (e.g., a node you run on your local network). Blacklists against Free APIs (i.e., Nodely) as you should be using your own nodes with this application.

### Fixed

* Windows: Adjust window to popup close to bottom tray area

## [0.1.0] - 2024-10-27

* Initial alpha release
