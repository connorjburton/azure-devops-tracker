const DBPrefix = 'azure-devops-watcher';

export default {
    DB: {
        TASKS: `${DBPrefix}-tasks`,
        PAT: `${DBPrefix}-pat`
    },
    AZURE: {
        URL: 'https://dev.azure.com/connorjburton/Test/_apis/',
        VERSION: '5.1'
    }
}