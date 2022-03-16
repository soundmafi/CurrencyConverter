// Эталонные значения
const basicRates =[
    {'BYN': 3.0082,'CNY': 6.3459,'EUR': 0.9134,'RUB': 123.2818,'USD': 1},
    {'BYN': 1,'CNY': 2.1268,'EUR': 0.3057,'RUB': 41.3663,'USD': 0.3351},
    {'BYN': 0.4742,'CNY': 1,'EUR': 0.1439,'RUB': 19.4408,'USD': 0.1576},
    {'BYN': 0.02478,'CNY': 0.05161,'EUR': 0.00742,'RUB': 1,'USD': 0.00814},
    {'BYN': 3.2996,'CNY': 6.9485,'EUR': 1,'RUB': 135.2038,'USD': 1.0948}
  ];
  
  let days = 14;                                         // количество дней для генерации дат
  let percentRate = 10;                                  // процент погрешности
  let currentRates = {};                                 // элемент хранилища выбранный по дате
  let storeRates = {};                                   // Хранилище курсов по датам
  const input = document.querySelector('#input');        // 
  const resultList = document.querySelector('.results'); // точка привязки нового списка валют
  const selectCurrency = document.querySelector('#select'); // точка выбора валют
  const inputDate = document.querySelector('#date');      // точка выбора даты
  let currentDate ='';                                    // текущая дата
  let selectedDate = '';                                  // выбранная дата
  let selectedCurrency = 'USD';                           // выбранная валюта (по умолчанию USD)
  const warning = document.querySelector('.warning');     // предупреждающий попап
  
  // loader
  currentDate = getCurData();                             // получаем текущуу дату
  let curDateParse = Date.parse(currentDate);             // переводим дату в численное значание
  inputDate.value = `${currentDate}`;                     // вписываем дату по умолчанию
  selectedDate = currentDate;                             // присваеваем выбранной дате значание по умолчанию
  generateStore();                                        // формируем хранилище
  renderChanges();                                        // отрисовываем в DOM курсы по умаолчанию
  
  // input currency select
  selectCurrency.addEventListener('change', event =>{
    let element = event.target;
    selectedCurrency = element.querySelector(`option[value ='${element.value}']`).value;
    renderChanges();
  });
  
  // live input enter
  input.addEventListener('input', event =>{
    let amount = event.target.value;                                   
    let BYN = document.getElementById('BYN');                             // точки записи значений валюты 
        BYN.textContent = +(amount * currentRates['BYN']).toFixed(4);    // значание
    let EUR = document.getElementById('EUR');
        EUR.textContent = +(amount * currentRates['EUR']).toFixed(4);
    let USD = document.getElementById('USD');
        USD.textContent = +(amount * currentRates['USD']).toFixed(4);
    let RUB = document.getElementById('RUB');
        RUB.textContent = +(amount * currentRates['RUB']).toFixed(4);
    let CNY = document.getElementById('CNY');
        CNY.textContent = +(amount * currentRates['CNY']).toFixed(4);
  });
  
  warning.addEventListener('click', event =>{
    let elementTarget = event.target.classList.value
    if ((elementTarget === 'warning')||(elementTarget === 'warning__btn')){
      warning.classList.toggle('invisible');
      renderList(currentRates,selectedCurrency);
    }
  })
  
  // Date input select
  inputDate.addEventListener('change',event=>{
    selectedDate = event.target.value;
    let selDateParse = Date.parse(selectedDate);
    let lastDateParse = curDateParse - 24*60*60*1000*days;
    let lastDate = new Date(lastDateParse).toISOString().substring(0,10);
  
    if (lastDateParse > selDateParse ){ 
      renderChanges();
      inputDate.value = `${lastDate}`;
      console.log('счётчик показан за 2-х недельную дату');
  
    }else if (curDateParse < selDateParse){
      renderChanges();
      inputDate.value = `${currentDate}`;
      warning.classList.toggle('invisible');
  
    }else{
      renderChanges();
    }
  });
  
  // getting selected rates
  function getRates(queryCurrency,queryDate){
    let lastDate = curDateParse - 24*60*60*1000*days;
    let queryDateParse = Date.parse(queryDate);
  
    if(queryDateParse < lastDate){
      queryDate = new Date(lastDate).toISOString().substring(0,10);
  
    } else if(queryDateParse > curDateParse){
      queryDate = currentDate;
    }
  
    storeRates[`${queryDate}`].forEach(element =>{
      if (element[queryCurrency] === 1){  
         currentRates = element;
      }
    });
  return currentRates;
  }
  
  // random Generator в погрешности 10%
  function randomChange(element){
    if (element !== 1){
    let randomNumber = +(Math.random() * percentRate).toFixed(2);
    (Math.random() * percentRate < 5 )? randomNumber = +`-${randomNumber}`: randomNumber;
    element -= element * (randomNumber / 100);
    }
  return element;
  }
  
  // генератор новых значения курсов
  function generateRate(rate){
    let newRate = [];
    rate.forEach(el =>{
      let newObj = {};
       for (let key in el){
        newObj[key] = randomChange(el[key]);
      }
      newRate.push(newObj);
    });
    return newRate;
  }
  
  // Формирование хранилища
  function generateStore (){
    let a = curDateParse;
    let tempDate = new Date(a).toISOString().substring(0,10);
    storeRates[`${tempDate}`] = basicRates; // Запись первого эталонного значения в хранилище
    for (let i = 0; i < days;  i++ ){
      a -= 24*60*60*1000;
      let tempDate = new Date(a).toISOString().substring(0,10);
      storeRates[`${tempDate}`] =  generateRate(basicRates); // Запись последеющих значений значения в хранилище
    } 
  }
  
  // получение текущей даты
  function getCurData(){
    let newDate = new Date;
    let newDateMonth = newDate.getMonth() + 1;
    (newDateMonth < 10)? newDateMonth = '0' + newDateMonth: newDateMonth;
    let result = `${newDate.getFullYear()}-${newDateMonth}-${newDate.getDate()}`;
  return result;
  }
  
  // Генератор элементов
  function elementBuilder(el,clName){
    let element = document.createElement(`${el}`);
    element.classList.add(`${clName}`);
    return element;
  }
  
  // Рендер списка валют
  function renderList(curRates,selectedCurrency){
    resultList.innerHTML ="";                     // очистка списка
    for (key in curRates){
        if (key !== selectedCurrency){
          resultList.append(renderItem(key,curRates[key].toFixed(4)));
        }else{
          let item = renderItem(key,curRates[key].toFixed(4));
          item.classList.add('invisible');
          resultList.append(item);
        }
    }
    input.value = 1;
  }
  
  // Рендер отельного списка
  function renderItem(currencyName,currencyValue){
    let item = elementBuilder('div','results__item');
    let currency = elementBuilder('p','results__currency');
    let value = elementBuilder('p','results__value');
        currency.textContent = `${currencyName}`;
        value.textContent = `${currencyValue}`;
        value.id = `${currencyName}`;
    item.appendChild(currency);
    item.appendChild(value);
    return item;
  }
  
  //функция перерисовки изменений
  function renderChanges(){
    getRates(selectedCurrency,selectedDate);
    renderList (currentRates,selectedCurrency);
  }