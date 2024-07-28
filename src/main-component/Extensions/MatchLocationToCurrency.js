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
        DKK: 'kr'
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
        case "Holland":
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
        case "Chuang":
        case "Estonia":
        case "Latvia":
        case "San Marino":
        case "Andorra":
            return currencySymbols.EUR;
        case "Switzerland":
            return currencySymbols.CHF;
        case "England":
        case "United Kingdom":
        case "Scotland":
        case "Wales":
            return currencySymbols.GBP;
        case "Norway":
            return currencySymbols.NOK;
        case "Iranian":
            return currencySymbols.IRR;
        case "Australia":
            return currencySymbols.AUD;
        case "Denmark":
            return currencySymbols.DKK;
        case "Russia":
            return currencySymbols.RUB;
        default:
            return currencySymbols.TRY;
    }
};
