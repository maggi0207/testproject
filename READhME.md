
# Setting Up and Running the Prod Parallel Backend and UI Locally for Development

## Overview
This guide provides step-by-step instructions to set up and run the Prod Parallel REST backend module and UI locally, allowing both to work together seamlessly during development.

## 1. Prerequisites
Ensure the following software is installed:

- **Java (JDK)** - Version 11 or higher (for running the backend)
- **Gradle** - For building the backend project
- **Node.js** - For running the front-end UI
- **IntelliJ IDEA** - For back-end development
- **VS Code** - For front-end development

## 2. Clone the Repositories
Clone the necessary repositories for both the front-end and back-end projects:

**Back-End (REST Module):**
```bash
git clone https://github.wellsfargo.com/app-epe/epe-ProdParallel-REST.git
```

**Front-End (Prod Parallel UI):**
```bash
git clone https://github.wellsfargo.com/app-epe/epe-pppUlreport.git
```

## 3. Running the Back-End in IntelliJ IDEA
The back-end REST module is a Gradle-based Java project with `EpePTDataConsumerApplication` as the main entry class.

### Open IntelliJ IDEA and Load the Back-End Project:
1. Open IntelliJ IDEA.
2. Go to **File > Open** and select the `epe-ProdParallel-REST` project folder.

### Build the Project:
1. Import the Gradle project if prompted.
2. Go to **Build > Build Project** to confirm there are no build errors.

### Run the Application:
1. Locate the main application file, `EpePTDataConsumerApplication.java`, usually found under `src/main/java/...`.
2. Right-click on `EpePTDataConsumerApplication.java` and select **Run 'EpePTDataConsumerApplication'**.
3. The backend server should now be running locally.

## 4. Verifying the Backend Setup
To ensure the backend is running correctly, test the API endpoint:

### Test the POST API Endpoint
You can test the POST API endpoint by sending an empty body:

- Use a command line with `curl`:
```bash
curl -X POST http://localhost:5050/api/v1/payments/datasets/all -H "Content-Type: application/json" -d '{}'
```

- Alternatively, you can test the endpoint using Postman:
  1. Open Postman and create a new POST request to:
  ```bash
  http://localhost:5050/api/v1/payments/datasets/all
  ```
  2. In the request body, select the **raw** option and choose **JSON** from the dropdown, then enter `{}` as the body content.
  3. Ensure you receive the expected response to confirm that the backend is functioning properly.

## 5. Running the Front-End UI in VS Code
### Open VS Code and Load the Front-End Project:
1. Open VS Code.
2. Go to **File > Open Folder** and select the `epe-pppUlreport` folder.

### Install Dependencies:
In the VS Code terminal, run:
```bash
npm install
```

### Start the Front-End Server:
Start the UI using:
```bash
npm start
```
The app will run locally and should be accessible at:
```bash
http://localhost:8080
```

## 6. Accessing the Front-End UI
Open a browser and navigate to:
```bash
http://localhost:8080
```
Confirm that the front-end loads correctly and can interact with the backend API.
