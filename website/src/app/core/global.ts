export const GlobalVariable = {

	SITE_NAME: " ",
	CURRENCY: '$',
	CURRENCY_NAME: 'USD',
	device_token: 'web_brower_token',
	device_type: 2,
	COUNTRY: '',
	PHONE_NUMBER: '',
	 COUNTRY_CODE: '',
	EMAIL: '',
	UNIQUE_ID: '',
	IS_MOBILE: false,
	AGENT_DB_KEY: '',
	WHATSAPP_NUMBER: '',
	WHATSAPP_NUMBER_CODE: '',
	// PATTERNS: {
	// email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
	// colors: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
	// },

	SECRET_DB_KEY: '',

	facebook_appId: '',

	google_clientId: '',

	imageType: ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'],

	BLOCK_HEADERS: ['https://apitest.cybersource.com/flex/v1/tokens', 'https://api.cybersource.com/flex/v1/tokens', 'https://testsecureacceptance.cybersource.com/pay', 'https://codebrew.royoapps.com/v1/common/client/user/track/info', 'https://jsonip.com', 'https://payments-dev.urway-tech.com', 'https://test.saferpay.com/api'],

	BLOCK_ERRORS: ['https://codebrew.royoapps.com/v1/common/client/user/track/info', 'https://jsonip.com', 'https://payments-dev.urway-tech.com', 'https://test.saferpay.com/api'],

	flowData: [],

	admin_domain: '',

	supplier_domain: '',

	DIALOGFLOW_PROJECT_ID: '',

	decimal_quantity_step: 0.15,

	INSTANCE_OPTIONS: {
		default: { user: 'https://api.royoapps.com', agent: 'https://onboarding-agent.royoapps.com' },
		monu: { user: 'https://monu-api.royodev.tk', agent: 'https://monu-agent.royodev.tk' },
		ishan: { user: 'https://ishan-api.royodev.tk', agent: 'https://onboarding-agent.royoapps.com', }, //'https://ishan-agent.royodev.tk' },
		gagan: { user: 'https://gagan-api.royodev.tk', agent: 'https://gagan-agent.royodev.tk' },
		sk: { user: 'https://sk-backend.netsolutionindia.com', agent: 'https://sk-backend.netsolutionindia.com' },
		naveen: { user: 'https://naveen-api.netsolutionindia.com', agent: 'https://naveen-api.netsolutionindia.com' }
	},

	FIREBASE_CONFIG: {
		apiKey: "AIzaSyBDRuECPQxMDSNk10A_wQpXnsEFKHJouaM",
		authDomain: "royo-977f3.firebaseapp.com",
		databaseURL: "https://royo-977f3.firebaseio.com",
		projectId: "royo-977f3",
		storageBucket: "royo-977f3.appspot.com",
		messagingSenderId: "907248328957",
		appId: "1:907248328957:web:2c6ded397ad18a871e1e94",
		measurementId: "G-C5MEVC617D"
	}

}



export const TableBookingStatus = {
	'': '',
	0: 'Pending',
	1: 'Confirm',
	2: 'Rejected',
	3: 'Completed'
}