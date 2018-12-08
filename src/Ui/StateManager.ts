const userProperties = PropertiesService.getUserProperties();

export class StateManager {
    public static stateManager

    public static getStateManager() {
        if (this.stateManager) {
            return this.stateManager
        }
        return this.stateManager = new StateManager()
    }
    private state

    constructor() {
        this.state = JSON.parse(userProperties.getProperty("state")) || {}
    }

    public getState(stateKey) {
        return this.state[stateKey] || {}
    }

    public setState(stateKey, state) {
        const currentState = this.state[stateKey]
        this.state[stateKey] = {...currentState, ...state}
        userProperties.setProperty("state", JSON.stringify(this.state))
        return this
    }

    public reset() {
        userProperties.deleteAllProperties()
    }

    public toString = (): string => {
        return JSON.stringify(this.state)
    }
}
