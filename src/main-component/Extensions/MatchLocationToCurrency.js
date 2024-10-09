import Cookies from 'js-cookie';

export const MatchLocationToCurrency = () => {
    const currencySymbols = {
        TRY: '₺',
        USD: '$',
        RUB: '₽',
        EUR: '€',
        CHF: 'CHF',
        GBP: '£',
        NOK: 'kr',
        IRR: '﷼',
        AUD: 'A$',
        DKK: 'kr',
        CAD: 'C$',     
        SEK: 'kr',     
        JPY: '¥',      
        CNY: '¥',    
        INR: '₹',      
        KRW: '₩',     
        BRL: 'R$',     
        MXN: '$',     
        ZAR: 'R',    
        NZD: 'NZ$'    
    };

    var location = Cookies.get("LocationData");

    switch (location) {
        case "Turkey":
            return currencySymbols.TRY;
        case "Germany":
        case "France":
        case "Spain":
        case "Italy":
        case "Portugal":
        case "Netherlands":  // Holland yerine Netherlands
        case "Greece":
        case "Belgium":
        case "Austria":
        case "Slovakia":
        case "Slovenia":
        case "Ireland":
        case "Finland":
        case "Cyprus":
        case "Malta":
        case "Lithuania":
        case "Monaco":
        case "Montenegro":
        case "Luxembourg":
        case "Estonia":
        case "Latvia":
        case "San Marino":
        case "Andorra":
            return currencySymbols.EUR;
        case "Switzerland":
            return currencySymbols.CHF;
        case "United States": 
            return currencySymbols.USD;
        case "Canada": 
            return currencySymbols.CAD;
        case "United Kingdom":
        case "England":
        case "Scotland":
        case "Wales":
            return currencySymbols.GBP;
        case "Norway":
            return currencySymbols.NOK;
        case "Iran": 
            return currencySymbols.IRR;
        case "Australia":
            return currencySymbols.AUD;
        case "Denmark":
            return currencySymbols.DKK;
        case "Russia":
            return currencySymbols.RUB;
        case "Sweden":  
            return currencySymbols.SEK;
        case "Japan":  
            return currencySymbols.JPY;
        case "China":  
            return currencySymbols.CNY;
        case "India":
            return currencySymbols.INR;
        case "South Korea":
            return currencySymbols.KRW;
        case "Brazil": 
            return currencySymbols.BRL;
        case "Mexico": 
            return currencySymbols.MXN;
        case "South Africa":  
            return currencySymbols.ZAR;
        case "New Zealand": 
            return currencySymbols.NZD;
        default:
            return currencySymbols.TRY;  
    }
};
