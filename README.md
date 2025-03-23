# Blondu Buletine

Blondu Buletine is a web application designed to process and extract information from Romanian Identity Cards. The application allows users to take pictures or load pictures of identity cards, submit them for processing, and view the extracted results. Users can also save the extracted data to a CSV file for further use.

## Features

- **Take Picture**: Capture a picture of an identity card using the device's camera.
- **Load Picture**: Load a picture of an identity card from the device's storage.
- **Submit Picture**: Submit the captured or loaded picture for processing.
- **View Results**: Display the extracted data from the submitted identity card.
- **Save to CSV**: Save the extracted data to a CSV file.
- **Show/Hide Results**: Toggle the visibility of the extracted data results.
- **Clear Results**: Reset the current results and saved status.

## Components

### `Authenticated`

The main component that manages the state and renders the various sub-components. It includes:

- **Profile**: Displays user profile information.
- **StatusBar**: Shows the current status of the application.
- **ProgressBar**: Displays the progress of the document processing.
- **PictureControl**: Contains the buttons for taking and loading pictures.
- **SubmitButton**: Button to submit the picture for processing.
- **ParsedDataDisplay**: Displays the extracted data from the identity card.
- **CSVButtons**: Buttons to show, clear, and download the CSV data.
- **CSVDisplay**: Displays the CSV data.
- **StatusBar**: Shows the current status of the application.

### `PictureButtons`

Contains the buttons for taking and loading pictures. It includes:

- **Take Picture**: Button to capture a picture using the device's camera.
- **Load Picture**: Button to load a picture from the device's storage.

### `SubmitButton`

Button to submit the captured or loaded picture for processing. It includes:

- **Submit Picture**: Button to submit the picture for processing.

### `ParsedDataDisplay`

Displays the extracted data from the submitted identity card. It includes:

- **Current Results**: Displays the extracted data in a table format.
- **Save to CSV**: Button to save the extracted data to a CSV file.
- **Show/Hide Results**: Button to toggle the visibility of the extracted data results.

### `CSVButtons`

Contains the buttons to show, clear, and download the CSV data. It includes:

- **Show CSV**: Button to display the CSV data.
- **Clear CSV**: Button to clear the CSV data.
- **Download CSV**: Button to download the CSV data.

### `CSVDisplay`

Displays the CSV data.

## API

The backend API is built using Azure Functions and processes the data using Azure Cognitive Services - Document Intelligence. When authenticated, the application sends the OAuth2 token to the API with the user-delegated rights, and the backend API processes the data.

## Usage

1. **Take or Load Picture**: Use the "Take Picture" or "Load Picture" button to capture or load a picture of an identity card.
2. **Submit Picture**: Click the "Submit Picture" button to submit the picture for processing.
3. **View Results**: The extracted data will be displayed in the "Current Results" section.
4. **Save to CSV**: Click the "Save to CSV" button to save the extracted data to a CSV file.
5. **Show/Hide Results**: Use the "Show" or "Hide" button to toggle the visibility of the extracted data results.
6. **Clear Results**: The results will be reset when the "Take Picture" or "Load Picture" buttons are pressed.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blondu-buletine.git
   ```
2. Navigate to the project directory:
   ```bash
   cd blondu-buletine
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Deployment

To create an optimized production build, run:
```bash
npm run build
```

Deploy the contents of the `build` directory to your preferred hosting service.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- [Create React App](https://create-react-app.dev/)
- [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/)
- [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js)


