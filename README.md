# Backend API for codepirate

## Dependencies
Fedora based Servers:
```
sudo yum groupinstall "Development Tools"
```
Ubuntu based Servers:
```
sudo apt-get update
sudo apt-get install build-essential
```
PM2 process manager:
```
npm install pm2 -g
```

## Setting up actions 
- Fork this repository to your own profile/organization
- Go to settings/Secrets and variables/Actions
    - Create a new repository secret called ENV
    - Populate it with contents from template.env and values
- Go to actions/runners and select Self-hosted runners
    - Select "New Runner" and follow the steps to create a new self hosted runner on your server
    - For linux, instead of using ``./run.sh`` use 
        ```
        sudo ./svc.sh install && sudo ./svc.sh start
        ```
- Manually run the Continuous Integration Task workflow once
    - Navigate to _work/codepirate_api/codepirate_api and run 
    ```
    pm2 start api.js --name codepirate-api
    ```

## Routes
- /team
- /createTeam
- /changeTeam
- /deleteTeam
- /login
- /leaveTeam