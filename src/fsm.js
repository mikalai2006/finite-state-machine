class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) throw new Error();
        this.def = config;
        this.mac = Object.assign({}, config);
        this.history = [
            {
                state: this.mac.initial,
                transition: false
            }
        ];
        this.histmarker = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.mac.initial;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.mac.states[state]) {
            throw new Error('State no found');
        }
        this.mac.initial = state;
        this.history.push({ state: this.mac.initial, transition: false });
        this.histmarker++;
        return state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (!this.mac.states[this.mac.initial].transitions[event]) {
            // console.log(this.mac.states[this.mac.initial].transitions)
            throw new Error();
        } else {
            this.mac.initial = this.mac.states[this.mac.initial].transitions[event];
            this.history.push({ state: this.mac.initial, transition: event });
            this.histmarker++;
        }
        // console.log(this.mac.initial)
        return this.mac.initial;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.mac = this.def;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let state = [];
        if (!event) {
            state = Object.keys(this.mac.states);
        } else {
            for (let key in this.mac.states) {
                if (this.mac.states[key].transitions[event]) {
                    state.push(key);
                }
            }
        }
        return state;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.length > 1 && this.histmarker > 0) {
            let undo_hist = this.history[this.histmarker-1];
            // console.log(undo_hist, this.histmarker)
            if (undo_hist.state) {
                this.mac.initial = undo_hist.state;

                if (undo_hist.transition) {
                    return false;
                } else {
                    this.histmarker--;
                    return true;
                }
                
            }/*  else {
                return false;
            } */
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        // console.log(this.history, this.histmarker, this.mac.initial)
        if (this.history.length > 1 && this.histmarker < this.history.length) {
            let redo_hist = this.history[this.histmarker+1];
            
            if (redo_hist.state) {
                this.mac.initial = redo_hist.state;

                if (redo_hist.transition) {
                    return false;
                } else {
                    this.histmarker++;
                    return true;
                }
                
            }
        } else {
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
