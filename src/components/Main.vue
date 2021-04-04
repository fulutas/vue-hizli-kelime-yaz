
<template>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>{{titleText}}</title>
  </head>

  <div class="container jumbotron bg-white">
    <div class="d-flex justify-content-between">  
    <h1 class="display-4">Hızlı Kelime Yazma Testi</h1>
   <select class="custom-select custom-select-lg timer-select" v-model="selectedTimer" @change="onChange" :disabled="isRunning">
    <option value="1">60 saniye</option>
    <option value="3">180 saniye</option>
    <option value="5">300 saniye</option>
  </select>
     <div class="toggle">
          <font-awesome-icon class="themeIcon" :icon="[ 'fas', 'moon' ]" @click="theme" v-if="themeSelected == 'light'" />
          <font-awesome-icon class="themeIcon" :icon="[ 'fas', 'sun' ]" @click="theme" v-else />
       </div>
    </div>
    <p class="lead">
      Hızlı yazma testi ile dakikada kaç kelime yazabileceğini öğren.
    </p>

    <div class="alert alert-primary" v-if="isFinish" >
        <h1>Test bitti. Süre doldu 🥳</h1>
        <p class="display-5">60 saniye içerisinde {{dks}} kelime yazdın.</p>
        <h6>Doğruluk Yüzdesi : %{{truePercent}}</h6>
        <h6>Doğru Kelime : {{ trueCount }}</h6>
        <h6>Yanlış Kelime : {{ falseCount }}</h6>

    </div>

    <div v-if="isFinish" class="d-flex justify-content-center align-items-center">
        <button class="btn btn-success btn-lg" @click="newGame">
            <font-awesome-icon :icon="[ 'fas', 'play-circle' ]" /> Yeni Teste Başla</button>
    </div>

    <div v-else>
    <div class="card mt-5">
      <div class="card-body">
          <span v-for="(word, key) in words.filter((data,index) => index<20)" :key="key" class="words ml-2" :class="key != 0 || writingWordControl ">
              {{ word }}
          </span>
          </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="input-group input-group-lg">
          <input type="text" class="form-control" placeholder="Kelimeyi yazınız." v-model="writingWord"/>
          <div class="input-group-append" id="button-addon4">
            <button class="btn btn-outline-secondary disabled bline" type="button" data-toggle="tooltip" data-placement="bottom" title="Sayacı gizle/göster için tıklayın." :class="[timer < 15 ? 'timer-danger' : null]" >
              <span class="tmp" @click="timerDisplayChange">{{timer}} sn.</span> 
            </button>
            <button class="btn btn-outline-secondary bline" type="button" @click="getWords" :disabled="isRunning">
                  <font-awesome-icon :icon="[ 'fas', 'sync-alt' ]" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>


    <div class="mt-5" v-if="testResult.length > 0"> 
      <div class="section-header d-flex justify-content-between">
      <h3>Geçmiş Test Sonuçları</h3>
      <button class="btn btn-danger" type="button" style="font-size:17px" @click="removeTestResult">
            <font-awesome-icon :icon="[ 'fa', 'trash' ]" /> Geçmişi sil
       </button>
       </div>
    <table class="table table-hover mt-4">
  <thead class="thead-dark">
    <tr class="brd">
      <th scope="col">#</th>
      <th scope="col">Doğru Kelime Sayısı</th>
      <th scope="col">Yanlış Kelime Sayısı</th>
      <th scope="col">Tarih</th>
    </tr>
  </thead>
  <tbody class="bg">
    <tr v-for="(test, index) in testResult" :key="index">
      <th scope="row" class="tColor">{{ index }} </th>
      <td>{{test.dogruKelimeSayisi}}</td>
      <td>{{test.yanlisKelimeSayisi}}</td>
      <td>{{test.tarih}}</td>
    </tr>
  </tbody>
</table>
    </div>

  </div>
</template>

<script>

import wordList from '@/assets/words.json'
import JQuery from 'jquery'

window.$ = JQuery

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();   
});

export default {
  name: "Main",
  components : {
      
  },
  data(){
      return {
          words : [],
          wordList : wordList,
          writingWord : null,
          isTrue : true, // yazılan kelime doğru mu kontrol değişkeni
          trueCount : 0, // doğru girilen kelime sayısı
          falseCount : 0, // yanlış girilen kelime sayısı
          timer : 60, // oyun süresi
          interval : false, // anlık geriye saydıran süre
          isRunning : false, // oyun başladı mı?
          isFinish : false, // oyun bitti mi?
          selectedTimer : 1, 
          themeSelected : "light",
          testResult : [],
      }
  },

  mounted(){
      this.getWords()

      let getItem = JSON.parse(localStorage.getItem('item'))
      if(getItem){
        this.testResult = getItem;
      }
      console.log(getItem)
  },

  watch : {
      writingWord(val){
          if(!val || val === ' '){
              this.writingWord = ''
              return;
          }
          // isRunning false (inputa bir kelime yazıldığında süreyi başlat)
          if(!this.isRunning){
              this.toggleTimer()
          }

         // array'den ilk sıradaki elemanı al ve ilk sıradaki harften(0) inputa girilen değerin uzunluğu kadar keser.
          let word = this.words[0].slice(0,val.length).toUpperCase(); 

          // Inputa Girilen değerde boşluk varsa boşluğu ortadan kaldır.
          let userWord = val.replace(' ','').toUpperCase(); 
          
          if(word === userWord){
              console.log("doğru")
              this.isTrue = true
          } else {
              console.log("yanlış")
              this.isTrue = false
          }

          // Boşluk tuşuna basıldığında.. 
          if(val.indexOf(' ') !== -1){
              this.isTrue ? this.trueCount++ : this.falseCount++
              this.words.splice(0,1)
              this.writingWord = ''
              this.isTrue = true // her space işleminden sonra true döndür(css rengi değişmesi için)
          }
      }
  },

  computed : {
      writingWordControl(){
          return this.isTrue ? 'writing-word' : 'writing-word bg-danger'
      },
      
      // dakika kelime sayısı
      dks(){
          return 300-this.words.length
      },
      
      // doğruluk yüzdesi 
      truePercent(){
          let percent =  (100/this.dks)
          const val = (percent * this.trueCount)
          return isNaN(val) ? 0 : val.toFixed(0)
      },

      timerDisplayChange(){
          const tmp = document.querySelector('.tmp')
          document.querySelector('.tmp').onclick = function(){
            tmp.classList.toggle('timeDisplayChange')
        }
      },

      titleText(){
          if(this.isRunning){
              return "Hızlı Kelime Yazma Testi - " + "Süre : " + this.timer
          } else {
             return "Hızlı Kelime Yazma Testi"
          }
      },
  },

  methods : {

      onChange(event) {
      
      let timerYakala = event.target.value

      console.log("onChange : " + timerYakala);
      console.log("timerAktif : " + this.timer);

       
        if(this.selectedTimer == 1){
            this.timer = 60

        }
        else if(this.selectedTimer == 3){
           this.timer = 180 
        } 
        else if(this.selectedTimer == 5){
            this.timer = 300
        }

        },

      toggleTimer(){
          this.isRunning = true
          this.interval = setInterval(this.timeProcess,1000)
      },
      
      // timer değişkenini azaltır.
      timeProcess(){

          // süre 0 olduğunda süre azaltmayı durdur ve oyunu bitir.
          if(this.timer == 0){
              clearInterval(this.interval)
              this.isFinish = true
              this.isRunning = false

              let createdDate = new Date()
              let createdFormat = createdDate.toLocaleString();
              
              let item = {'dogruKelimeSayisi' : this.trueCount, 'yanlisKelimeSayisi' : this.falseCount, 'tarih' : createdFormat}
              this.testResult.push(item)
              localStorage.setItem("item", JSON.stringify(this.testResult))
              
              return;
          }
          this.timer--
      },
      
      getWords(){
          this.words = this.wordList.sort(()=> Math.random() - 0.5).splice(0,300) 
      },

      newGame(){
          this.getWords()
          this.isFinish = false
          this.timer = 60
          this.isTrue = true
          this.isRunning = false
          this.writingWord = ''
      },

      theme(){
         if(document.body.classList.contains('dark')){
            this.themeSelected = "light"
        } else {
            this.themeSelected = "dark"
        }

        const body = document.querySelector('body')
        document.querySelector('.toggle').onclick = function(){
            body.classList.toggle('dark')
        }
      },
      removeTestResult(){
          Swal.fire({
                title: 'Silmek istediğinizden emin misiniz?',
                text: "",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#008000',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Evet'
                }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                    'Başarılı',
                    '',
                    'success'
                    )
                localStorage.removeItem("item")
                this.testResult.length = 0
               }
         })
      },
  },
};
</script>

<style scoped>


.words {
    font-size: 25px;
    font-weight: 400;
}

.writing-word{
    background-color: green;
    padding: 5px;
    border-radius: 10px;
    color: white;
}

.timer-danger {
    opacity: 1!important;
    background: #dc3545!important;
    color: #fff!important;
}

.form-control:focus {
    box-shadow: none;
    border-color: #6c757d;
}

.bline:focus{
    box-shadow: none;
    border-color: #6c757d;
}

/* dark and light mode div */
.toggle{
    width: 48px;
    height: 48px;
    background: #03695c;
    color: azure;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.4s ease-in-out;
    font-size: 30px;
    margin-top: 17px;
}

.toggle::before{
    content: '';
    font-family: fontAwesome;
    font-size: 30px;
}

body.dark .toggle{
    background: #ffea52;
    color: #181818;
    transition: all 0.4s ease-in-out;
}

body.dark .container  {
     background-color: #181818!important;
     color: #fff;
     transition: background 0.4s;
}

body.dark .container .card {
     background-color: #181818!important;
     color: #fff;
     border-color: rgb(87, 86, 86);
     transition: background 0.4s;
}

body.dark .form-control {
    background-color: #121212;
    border-color: #313131;
    color : azure;
}

body.dark .timer-select {
    background-color: #121212;
    color : azure;
    border-color: rgb(87, 86, 86);
    transition: background 0.4s;
}

body.dark .bg {
    color: azure;
}

body.dark .table-hover tbody tr:hover {
    color: azure;
    background-color: rgb(35 39 39);
}

.custom-select {
    width: 20%;
}

.timer-select {
    margin-left: auto;
    margin-right: 30px;
    margin-top: 17px;
}

.timer-select:focus {
    box-shadow: none;
    border-color: #6c757d;
}

option:checked {
    background-color: #6c757d;
    color: azure;
}

.timeDisplayChange {
    filter: blur(1rem) !important;
}

.brd > th:nth-child(1){
border-radius:10px 0px 0px 10px;
}

.brd > th:nth-child(4){
border-radius:0px 10px 10px 0px;
}

.table .thead-dark th {
    color: #fff;
    background-color: #03695c;
    border: 0;
    letter-spacing: 0.20px;
}

</style>
