"use strict";

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    coins: [],
    currencies: [],
    selectedCoinIndex: 0,
    selectedOperation: 'BUY',
    amount: 0,
    currencyIndex: 0,
    currentUnit: ''
  },
  created: function () {



    this.getCurrencies();
    this.getCoins();
  },
  methods: {
    changeCurrency: function () {
      this.cryptoPriceInCurrency()
    },
    cryptoPriceInCurrency: function () {

      let amount = this.coins[this.selectedCoinIndex].usd_value * this.currencies[this.currencyIndex].dollar_rate;
      this.amount = (this.currentUnit === "")? amount : amount * this.currentUnit;
      this.amount = this.amount.toFixed(4);
      this.amount = (isNaN(this.amount))? 0: this.amount;

       if(this.currentUnit === ''){
          this.calculateCryptoValue();
       }
    },
    calculateCryptoValue: function () {

      this.currentUnit = (this.amount / this.currencies[this.currencyIndex].dollar_rate) / this.coins[this.selectedCoinIndex].usd_value

      this.currentUnit = (isNaN(this.currentUnit))? 0: this.currentUnit;


    },
    changeCurFromCrypto: function () {

      this.amount = this.coins[this.selectedCoinIndex].usd_value *    this.currencies[this.currencyIndex].dollar_rate * this.currentUnit;

      this.amount = this.amount.toFixed(4);
      this.amount = (isNaN(this.amount))? 0: this.amount;
    },
    selectCoin: function (coin_index) {
      this.selectedCoinIndex = coin_index;
      if(this.currencyIndex != 0){
        this.cryptoPriceInCurrency()
      }
    },
    getCoins: function () {
      var headers = {};
      headers['Access-Control-Allow-Origin'] = "*";

      this.$http.get('https://api.coinmarketcap.com/v1/ticker/', {}, { headers: headers})
      .then(response => {
        var selected_coins = ['BTC', 'BCH', 'ETH', 'LTC', 'NEO'],
        counter = 1;
        for (var i = 0; i < response.body.length; i++) {
          if( selected_coins.includes(response.body[i].symbol)){
            var coin = response.body[i];
            this.coins.push({name: coin.symbol, usd_value: coin.price_usd, unit: 1});
            counter++;
          }
        }

      }, err => {
        console.log(err);
      });
    },
    getCurrencies: function () {
      var headers = {};
      headers['Access-Control-Allow-Origin'] = "*";
      // headers['Access-Control-Allow-Headers']= 'Origin, X-Requested-With, Content-Type, Accept';
      // bec8bb40527641a9a4bebaf474b153fc
      // https://free.currencyconverterapi.com/api/v5/convert?q=USD_NGN&compact=y
      this.$http.get('https://openexchangerates.org/api/latest.json?app_id=bec8bb40527641a9a4bebaf474b153fc&symbols=NGN', {}, { headers: headers})
      .then(response => {

        this.currencies.push({name: 'Select Currency', dollar_rate: 0},
                            {name: 'Naira', dollar_rate: response.body.rates.NGN.toFixed(2)},
                            {name: 'USD', dollar_rate: 1}
                            );
      },
      err => {
        console.log(err);
      })
    },
    isActive: function (index) {
      return this.selectedCoinIndex === index;
    }
  }
})