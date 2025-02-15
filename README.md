# SIMD96 Block Reward Sharing Tool

## Overview

SIMD96 is out, but currently, validators face challenges in sharing block rewards with stakers. While we await the release of SIMD0123, this tool provides an efficient solution to calculate and distribute block rewards among stakers.

## Features

- **Effortless Calculation**: Automatically calculates block rewards for validators.
- **Seamless Distribution**: Facilitates the sharing of rewards with stakers.
- **Integration with APIs**: Utilizes RESTful APIs like Stakewiz and Trillium to fetch and process validator data.

## How It Works

1. **Data Fetching**: The tool connects to Stakewiz and Trillium APIs to gather necessary validator data.
2. **Reward Calculation**: Using the fetched data, it calculates the block rewards for each validator.
3. **Reward Distribution**: The calculated rewards are then distributed to the respective stakers.

## Getting Started

### Prerequisites

- make sure you have a valid RPC endpoint




## Contributing

We welcome contributions! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
