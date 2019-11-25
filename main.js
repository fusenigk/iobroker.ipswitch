"use strict";

/*
 * Created with @iobroker/create-adapter v1.17.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const request = require('request');

// Load your modules here, e.g.:
// const fs = require("fs");

class stromlog extends utils.Adapter {

	/**
	 * @param {Partial<ioBroker.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: "stromlog",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("objectChange", this.onObjectChange.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		// this.log.info("config option1: " + this.config.option1);
		// this.log.info("config option2: " + this.config.option2);
		
		this.log.info("onReady");
		this.log.info("config stromlog-Ip sensor: " + this.config.stromlogip);

		//var url = "http://" + this.config.stromlogip + "/csv.html" ;
		
		request(
                    {
                        url: 'http://' + this.config.stromlogip + '/csv.html',
                        json: false,
                        time: true,
                        timeout: 4500
                    },
                    
                    (error, response, content) => {
                        this.log.info('local http request done');

                        if (response) {
                        	this.log.info('received data (' + response.statusCode + '): ' + content);

                        	var tokens = content.split(',') ;

                        	//this.log.info('Token1: ' + tokens[0]) ;
                        	//this.log.info('Token2: ' + tokens[2]) ;

                        	var tokenName = tokens[0] ;
                        	var tokeniC1 = tokens[1] ;
                        	var tokeniC2 = tokens[2] ;
                        	var tokeniC3 = tokens[3] ;
							var tokenTemp = tokens[4] ;

							this.log.info('Name: ' + tokenName) ;
                        	this.log.info('iC1: ' + tokeniC1) ;
                        	this.log.info('iC2: ' + tokeniC2) ;
                        	this.log.info('iC3: ' + tokeniC3) ;
                        	this.log.info('Temp: ' + tokenTemp) ;

							this.setObjectNotExists('IC1' , {
					                                            type: 'state',
					                                            common: {
					                                                name: 'IC1',
					                                                type: 'number',
					                                                role: 'value',
					                                                unit: 'kW/h',
					                                                read: true,
					                                                write: false
					                                            },
					                                            native: {}
					                                        });

					        this.setState('IC1', {val: parseFloat(tokeniC1), ack: true});

							this.setObjectNotExists('IC2' , {
					                                            type: 'state',
					                                            common: {
					                                                name: 'IC2',
					                                                type: 'number',
					                                                role: 'value',
					                                                unit: 'kW/h',
					                                                read: true,
					                                                write: false
					                                            },
					                                            native: {}
					                                        });

					        this.setState('IC2', {val: parseFloat(tokeniC2), ack: true});

							this.setObjectNotExists('IC3' , {
					                                            type: 'state',
					                                            common: {
					                                                name: 'IC3',
					                                                type: 'number',
					                                                role: 'value',
					                                                unit: 'kW/h',
					                                                read: true,
					                                                write: false
					                                            },
					                                            native: {}
					                                        });

					        this.setState('IC3', {val: parseFloat(tokeniC3), ack: true});

							this.setObjectNotExists('Temp' , {
					                                            type: 'state',
					                                            common: {
					                                                name: 'Temp',
					                                                type: 'number',
					                                                role: 'value',
					                                                unit: 'C',
					                                                read: true,
					                                                write: false
					                                            },
					                                            native: {}
					                                        });

					        this.setState('Temp', {val: parseFloat(tokenTemp), ack: true});

							this.setObjectNotExists('Name' , {
					                                            type: 'state',
					                                            common: {
					                                                name: 'Name',
					                                                type: 'string',
					                                                role: 'value',
					                                                unit: '',
					                                                read: true,
					                                                write: false
					                                            },
					                                            native: {}
					                                        });

					        this.setState('Name', {val: tokenName, ack: true});

 						} else if (error) {
                            this.log.info(error);
                        }
                    }
                );
		/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/
		// await this.setObjectAsync("testVariable", {
		// 	type: "state",
		// 	common: {
		// 		name: "testVariable",
		// 		type: "boolean",
		// 		role: "indicator",
		// 		read: true,
		// 		write: true,
		// 	},
		// 	native: {},
		// });

		// in this template all states changes inside the adapters namespace are subscribed
		this.subscribeStates("*");

		/*
		setState examples
		you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)
		//await this.setStateAsync("testVariable", true);


		// // same thing, but the value is flagged "ack"
		// // ack should be always set to true if the value is received from or acknowledged from the target system
		//await this.setStateAsync("testVariable", { val: true, ack: true });

		// // same thing, but the state is deleted after 30s (getState will return null afterwards)
		//await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

		// // examples for the checkPassword/checkGroup functions
		// let result = await this.checkPasswordAsync("admin", "iobroker");
		// this.log.info("check user admin pw ioboker: " + result);

		// result = await this.checkGroupAsync("admin", "admin");
		// this.log.info("check group user admin group admin: " + result);


		 setTimeout(this.stop.bind(this), 10000);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			this.log.info("cleaned everything up...");
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Is called if a subscribed object changes
	 * @param {string} id
	 * @param {ioBroker.Object | null | undefined} obj
	 */
	onObjectChange(id, obj) {
		if (obj) {
			// The object was changed
			this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
		} else {
			// The object was deleted
			this.log.info(`object ${id} deleted`);
		}
	}

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.message" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }

}

// @ts-ignore parent is a valid property on module
if (module.parent) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<ioBroker.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new stromlog(options);
} else {
	// otherwise start the instance directly
	new stromlog();
}