'use strict'

const html = require('pithy')

module.exports = {
    title: 'PKP price calendar',
    ogTitle: 'pkp.prices.wtf - PKP train price calendar',
    ogDescription: 'pkp.prices.wtf shows you the cheapest PKP train ticket prices for an entire month! 🚆',
    ogImage: 'https://bahn.guru/assets/screenshot.png',
    originShort: 'Od',
    originPlaceholder: 'Origin',
    destinationShort: 'Do',
    destinationPlaceholder: 'Destination',
    submit: 'Search',
    shopLinkTitle: 'Show connection on bilkom.pl',
    mainTitle: 'Price calendar',
    faqTitle: 'FAQ',
    legalTitle: 'Legal',
    faq: [
        {
    		title: 'Is this an official website by PKP/Bilkom?',
    		description: [
    			'No, this website is FOSS by ',
    			html.a({href: 'https://codefor.de/berlin/'}, 'OK Lab Berlin'),
    			'. All pricing information without engagement, please double-check the results on the ',
    			html.a({href: 'https://bilkom.pl'}, 'bilkom.pl'),
    			' website.'
    		]
    	},
    	{
    		title: 'Where do you get the data from?',
    		description: [
    			'This website uses an ',
    			html.a({href: 'https://github.com/juliuste/bilkom'}, 'inofficial endpoint'),
    			' by Bilkom/PKP.'
    		]
    	},
    	{
    		title: 'Do you make a profit running this website?',
    		description: 'No. No advertising revenue, no affiliate links. Because of server operating costs, this website is even a little unprofitable. But we feel like that\'s worth it.'
    	}
    ]
}
