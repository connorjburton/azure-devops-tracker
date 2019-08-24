const DBPrefix = 'azure-devops-watcher';

export default {
    DB: {
        TASKS: `${DBPrefix}-tasks`,
        PAT: `${DBPrefix}-pat`
    },
    AZURE: {
        URL: 'https://dev.azure.com/connorjburton/Test/_apis/',
        VERSION: '5.1',
        CONTENT_TYPE: {
            GET: 'application/json',
            PATCH: 'application/json-patch+json'
        },
        FIELDS: {
            REMAINING: 'Microsoft.VSTS.Scheduling.RemainingWork',
            COMPLETED: 'Microsoft.VSTS.Scheduling.CompletedWork'
        }
    }
}