var root_url = "http://comp426.cs.unc.edu:3001";

$(document).ready(() => {

  //plane change functionality
      $("body").on("click", '.p',  function(){
          $('body').empty()
          $('body').css('background-image', 'none');
          $('body').append('<img  src="aa.png" id="logo-up" alt="american account logo" >')
          $('body').css('background-image', 'url(' + encodeURIComponent('bg2.jpg') + ')');
  //$('body').css('background-size: cover; background-position: center; width: 100%; height 100%; background-repeat: no-repeat;')
          $('body').css('background-size', 'cover')
          $('body').css('background-position', '0% 2%')
          $('body').css('width', '95%')
          $('body').css('height', '105%')
          $('body').css('background-repeat', 'no-repeat')
          $('body').append('<div class= "new_nav"><button class="sa">Search for a Flight</button><button class="t ss" >Update a Ticket</button><button class="active p sb">Add Itinerary</button></div><br> ');
          $('.new_nav').append('<div class="ticket_div" id="planediv"></div>');
          $("#planediv").append('<div id="searchholder"><input type="text" class="search_plane" id="Email" placeholder="Enter Email"><div id="autocompleteholder"></div></div>');
          $("#planediv").append('<button class="sub_tix x">Create</button>');
          $(".sub_tix").on("click", function(){
              var email = $("#Flight").val();
              var confirmation = makeid();
              $.ajax(root_url+"/itineraries",
                  {
                      type:'POST',
                      data:{
                          'itinerary':{
                              "confirmation_code": confirmation,
                              "email":email
                          }
                      },
                      xhrFields:{withCredentials:true},
                      success:(response)=>{
                          $('#planediv').empty();
                          $("#planediv").append("<div class='message'>Update Successful</div>");
                      }
                  });
          })
          $('body').on('keyup','#Email', function(){
              var info = $("#Email").val();
              $("#autocompleteholder").empty();
              $(".autocomplete").empty();
              $.ajax(root_url+"/itineraries?filter[email_like]="+info,
                  {
                      type:'GET',
                      xhrFields:{withCredentials:true},
                      success:(response)=>{
                          var emails = response;
                          var limit;
                          if(parseInt(emails.length)<2){
                              limit=parseInt(emails.length);
                          }
                          else{
                              limit = 2;
                          }
                          console.log(emails);
                          for(let i=0; i<limit; i++){
                              console.log(i)
                              console.log(emails[i]);
                              let p = $("<div class='autocomplete'>"+emails[i].email+"</div>");
                              p.on("click", function(){
                                  $("#Email").val(emails[i].email);
                                  $(".sub_tix").trigger("click");
                                  $("#autocompleteholder").empty();
                              });
                              $("#autocompleteholder").append(p);
                          }
                      }

                  })
          } )

      });

  // search functionality
    $('body').on('click', '.sub',function(){

	let input = $('.search').val();
	let category = $('.cat').val();

	//console.log(input);
	//console.log(category);


input_upper = input.toUpperCase()
//console.log(input_upper)
if(category == 1){

  $.ajax(root_url + '/airports?filter[code]=' + input_upper,
	       {
		   type: 'GET',
		   xhrFields: {withCredentials: true},

		   success: (response) => {
          $('.search_cont').hide()
        //  console.log(response)
		     // console.log('success', input_upper)

          let answers = response
          let qdiv = $('.main')
        //  console.log(answers)
          for (let i=0; i<answers.length; i++) {
            qdiv.append('<div class="n color"><h2 class="color">' + answers[i].name + '</h2></div>')
          ///  alert(answers[i].city)
          //  alert(answers[i].state)
            let ID = answers[i].id
            let place =answers[i].city
            get_weather(place);

        $.ajax(root_url + '/flights?filter[arrival_id]=' + ID ,
                   {
                 type: 'GET',
                 xhrFields: {withCredentials: true},

                 success: (response) => {
                   let flights_arr = response
                   qdiv.append('<div class= "arr"><h3 class="color">Arrivals</h3></div>')
                   $('.main').addClass('scroll')
                  for (let i=0; i<flights_arr.length; i++) {
                   let flight_id = flights_arr[i].id
                   let flight_departure = flights_arr[i].departs_at
                   flight_departure = change_time(flight_departure)
                   let flight_arrival = flights_arr[i].arrives_at
                   flight_arrival = change_time(flight_arrival)
                //   let place = answers[i].city
                //   console.log(place)




                  $.ajax(root_url + '/instances?filter[flight_id]=' + flight_id ,
                           {
                           type: 'GET',
                           xhrFields: {withCredentials: true},

                           success: (response) => {
                           let flight_in = response
                        //   console.log(flight_in)
                           let airline_id
                            let instance_id
                           for (let j=0; j<flight_in.length; j++) {
                             let flight_instance_id =flight_in[j].flight_id

                             if (flight_instance_id == flight_id){
                               airline_id = flights_arr[i].airline_id
                               instance_id = flight_in[j].id
                             }

                $.ajax(root_url + '/airlines?filter[airline_id]=' + airline_id ,
                         {
                         type: 'GET',
                         xhrFields: {withCredentials: true},

                         success: (response) => {
                           let airlines = response

                $.ajax(root_url + '/tickets?filter[instance_id]=' + instance_id ,
                                               {
                                type: 'GET',
                                xhrFields: {withCredentials: true},
                                success: (response) => {
                                  let tickets = response
                                  let f_name
                                  let l_name
                                  let age
                                  let gender
                                  for (let k=0; k<tickets.length; k++) {
                                  f_name =tickets[k].first_name
                                  l_name =tickets[k].last_name
                                  age =tickets[k].age
                                  gender =tickets[k].gender
                                                 }



                     $('.arr').append('<button class=" nav">' + airlines[i].name + '</button>')
                    $('.arr').append('<div class="passengers">' + f_name +'    '+ l_name + '<p>' + age + '   ' + gender + '</p></div>')
                    $('.passengers').hide()
                    $('.arr').append('<p class="a">' +'       '+ flight_in[j].date +'      departs-'+ flight_departure +'    arrives-'+ flight_arrival + '</p>')
}
})
}
})
}
}
})
}

              $.ajax(root_url + '/flights?filter[departure_id]=' + ID ,
                         {
                       type: 'GET',
                       xhrFields: {withCredentials: true},

                       success: (response) => {
                         let flights_dep = response
                         let airline_ids = new Array()
                         qdiv.append('<div class= "dep"><h3 class ="color">Departures</h3></div>')


                        for (let i=0; i<flights_dep.length; i++) {
                         let flight_id = flights_dep[i].id
                        let airline_id = flights_dep[i].airline_id
                         let flight_departure = flights_dep[i].departs_at
                         flight_departure = change_time(flight_departure)
                         let flight_arrival = flights_dep[i].arrives_at
                         flight_arrival = change_time(flight_arrival)


               $.ajax(root_url + '/instances?filter[flight_id]=' + flight_id ,
                        {
                        type: 'GET',
                        xhrFields: {withCredentials: true},

                        success: (response) => {
                        let flight_in = response
                        let airline_id
                        let instance_id
                        for (let j=0; j<flight_in.length; j++) {
                          let flight_instance_id =flight_in[j].flight_id
                          if (flight_instance_id == flight_id){
                            airline_id = flights_dep[i].airline_id
                            instance_id = flight_in[j].id
                          }


                      $.ajax(root_url + '/airlines?filter[airline_id]=' + airline_id ,
                               {
                               type: 'GET',
                               xhrFields: {withCredentials: true},

                               success: (response) => {
                                 let airlines = response



                      $.ajax(root_url + '/tickets?filter[instance_id]=' + instance_id ,
                                          {
                                          type: 'GET',
                                          xhrFields: {withCredentials: true},


                                          success: (response) => {

                                            let tickets = response
                                            let f_name
                                            let l_name
                                            let age
                                            let gender
                                          //  console.log(tickets)
                                          for (let k=0; k<tickets.length; k++) {
                                            f_name =tickets[k].first_name
                                            l_name =tickets[k].last_name
                                            age =tickets[k].age
                                            gender =tickets[k].gender
                                            }


                               $('.dep').append('<button class=" nav">' + airlines[i].name + '</button>')
                               $('.dep').append('<div class="passengers">' + f_name +'    '+ l_name + '<p>      ' + age + '   ' + gender + '</p></div>')
                               $('.passengers').hide()
                                  $('.dep').append('<p class="a">' +'       '+ flight_in[j].date +'   departs-'+ flight_departure +'   arrives-'+ flight_arrival + '</p>')
}

})

      }
    })

}
}
})
}
}
})
}
})
     }
}
})
}


if (category == 3){
alert('Please verify that your time was enetered in the following format ex: 01:30pm')
$('.sub').remove()
$('#select').append('<br><select class="tim"><option value="0">Arriving or Departing:</option><option value="Arrivals">Arrivals</option><option value="Departures">Departures</option></select>')
$('#select').append('<br><select class="eq"><option value="0"> your specified time</option><option value="1">< your specified time</option><option value="2">= your specified time</option></select>')



}

let val;
$('body').one('click', '.eq',function(){
   val = $('.tim').val()
  $('#select').append('<button class="time_search"> Search ' + val + '</button>')

})


$('body').one('click', '.time_search',function(){
//  console.log('inside time_search')
  $('.search_cont').hide()
  let qdiv = $('.main')
  qdiv.addClass('scroll')
let less_great = $('.eq').val()
let time = $('.search').val()
if (less_great == 0){
  less_great = 'gt'
}
if (less_great == 1){
  less_great = 'lt'
}
if (less_great == 2){
  less_great = 'eq'
}

time = mil_time(time)

//console.log(time)
$.ajax(root_url + '/flights?filter[departs_at_' + less_great + ']='+ time ,
                    {
                    type: 'GET',
                    xhrFields: {withCredentials: true},


                    success: (response) => {
                    //  console.log(response)
                      let flights = response
                    //  console.log(response)
                      for(let i =0; i < 5; i ++){
                        let id = flights[i].id
                      //  console.log(id)
                        let arrives = flights[i].arrives_at
                        arrives = change_time(arrives)
                        let departs = flights[i].departs_at
                        departs = change_time(departs)
                        let arrival_id = flights[i].arrival_id
                        let departure_id = flights[i].departure_id

        $.ajax(root_url + '/airports/' + arrival_id ,
                  {
                      type: 'GET',
                      xhrFields: {withCredentials: true},


                      success: (response) => {
                      let arrival_airline = response

                      let arrival = arrival_airline.name

        $.ajax(root_url + '/airports/' + departure_id ,
                  {
                      type: 'GET',
                      xhrFields: {withCredentials: true},


                      success: (response) => {
                      let departure_airline = response

                      let departure = departure_airline.name


                        qdiv.append('<h3 class="color"> '+ departure + ' to '+  arrival + '</h3>')
                      qdiv.append('<div class ="flight_info" data-id= '+ id +'><p class ="color a">Flight_ID-' + id + '  departs-'+ departs+ '  arrives-'+ arrives + '</p><button class="cancel">Cancel Flight</button></div>')


}
})
}
})
}
}
})


})







$('body').on('click', '.cancel',function(){
//  console.log('inside')

  let id = $(this).parent().data('id');

  console.log(id)

  var dateObj = new Date();

 var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);

 var date = ('0' + dateObj.getDate()).slice(-2);

 var year = dateObj.getFullYear();

 var shortDate = year + '-' + month + '-' + date;

let instance_id
$.ajax(root_url + '/instances?filter[flight_id]=' + id ,
            {
          type: 'GET',
          xhrFields: {withCredentials: true},
          success: (response) => {
              console.log('in')
            for(let j =0; j < response.length ; j ++){

                let date = response[j].date

                if(date == shortDate){
                   instance_id = response[j].id
                }
              }

console.log(instance_id)
$.ajax(root_url + "/instances/" + instance_id,
      {
                type:'PATCH',
                data:{
                    "instance":{
                        "is_cancelled": true

                    }
                },
                xhrFields:{withCredentials:true},
                success:(response)=>{
                    console.log('Successful')
                    $(this).parent().addClass('strike')
                }
            });
    }



})
})

})



function change_temp(temp){
  temp = (temp - 273.15) * 9/5 + 32
  temp = temp.toFixed(2);
  return temp;

}



function change_time(time){
  time = time.substring(11,16)
  let t = time;
  let end = t.substring(3)
//  console.log('end',end)
  //console.log(time)
//  console.log('t',t.charAt(0))
  if(t.charAt(0) == '0'){
    time = time + 'am'}
  if(t.charAt(0) == 1 && t.charAt(1) == 0){
    time = time + 'am'}
  if(t.charAt(0) == 1 && t.charAt(1) == 1){
    time = time + 'am'}
  if(t.charAt(0) == 1 && t.charAt(1) == 2){
    time = time + 'pm'}
  if(t.charAt(0) == 1 && t.charAt(1) == 3){
    time = '01:' + end +  'pm'}
  if(t.charAt(0) == 1 && t.charAt(1) == 4){
      time = '02:' + end +  'pm'}
  if(t.charAt(0) == 1 && t.charAt(1) == 5){
      time = '03:' + end +  'pm'}
  if(t.charAt(0) == 1 && t.charAt(1) == 6){
      time = '04:' + end +  'pm'}
  if(t.charAt(0) == 1 && t.charAt(1) == 7){
      time = '05:' + end +  'pm'}
  if(t.charAt(0) == 1 && t.charAt(1) == 8){
      time = '06:' + end +  'pm'}
  if(t.charAt(0) == 1 && t.charAt(1) == 9){
      time = '07:' + end +  'pm'}
  if(t.charAt(0) == 2 && t.charAt(1) == 0){
      time = '08:' + end +  'pm'}
  if(t.charAt(0) == 2 && t.charAt(1) == 1){
      time = '09:' + end +  'pm'}
  if(t.charAt(0) == 2 && t.charAt(1) == 2){
      time = '10:' + end +  'pm'}
  if(t.charAt(0) == 2 && t.charAt(1) == 3){
      time = '11:' + end +  'pm'}
  if(t.charAt(0) == 0 && t.charAt(1) == 0){
      time = '12:' + end +  'am'}

  return time;
}

function hide_search(){
  $('.search_cont').hide()
}
function get_weather(place){
  //console.log(place)

  $.ajax("https://api.openweathermap.org/data/2.5/weather?q=" + place + "&APPID=e34ee15430be41badb3a2ff7b779c8a0",
            {
            type: 'GET',

            success: (response) => {
              let qdiv = $('.main')
            //  console.log(response)
              let main = response.main
              let weather = response.weather
             let icon_id = weather[0].icon
            //  icon_id = icon_id.substring(0,4)
              console.log(weather)
              //console.log(weather.icon)
              let temp = main.temp
              temp = change_temp(temp)


            //  console.log(main)
            //  console.log(main.temp)
            //  console.log(weather)
            //  console.log(weather[0].description)
              $(".main").append('<div class= "weather"><p><b>Weather:</b> ' + weather[0].description + '</p><p><img src="http://openweathermap.org/img/w/'+ icon_id +  '.png"><p>Temperature: ' + temp+ ' degrees</p>'+ '<p>Humidity: '+ main.humidity + '</p></div>')


}
})
}

function build_search(){
  $('body').empty()
  $('body').append('<img  src="aa.png" id="logo" alt="american account logo" ><div class="main"><div class="modes"><button class="nav active s">Search for a Flight</button><button class="nav t" >Update a Ticket</button><button class="nav p">Add Itinerary</button></button></div><div class="search_cont"><input type="text" class="search" placeholder="Search for a Fight..."><div id="select"><select class="cat"><option value="0">Search by:</option><option value="3">Time</option><option value="1">Airport</option></select><br><button class="sub"> Start Searching...</button></div></div></div></div>')

}
function mil_time(time){
  let end = time
//  console.log('time bef', time)
  time = time.substring(0,5)
  end = end.substring(5)
  let begin = time
  let mid = time
  begin= begin.substring(0,2)
  mid = mid.substring(3)
  //console.log('end', end)
//  console.log('begin', begin)
//  console.log('time', time)
//  console.log('mid', mid)

  if (end = 'am' && begin != '12'){
    time = time
  }
  if(end == 'am' && begin == '12'){
    time = '00:' + mid
  }
  if(end == 'pm' && begin == '12'){
    time = '12:00'
  }
  if( end == 'pm' && begin == '01'){
    time = '13:' + mid
  }
  if( end == 'pm' && begin == '02'){
    time = '14:' + mid
  }
  if( end == 'pm' && begin == '03'){
    time = '15:' + mid
  }
  if( end == 'pm' && begin == '04'){
    time = '16:' + mid
  }
  if( end == 'pm' && begin == '05'){
    time = '17:' + mid
  }
  if( end == 'pm' && begin == '06'){
    time = '18:' + mid
  }
  if( end == 'pm' && begin == '07'){
    time = '19:' + mid
  }
  if( end == 'pm' && begin == '08'){
    time = '20:' + mid
  }
  if( end == 'pm' && begin == '09'){
    time = '21:' + mid
  }
  if( end == 'pm' && begin == '10'){
    time = '22:' + mid
  }
  if( end == 'pm' && begin == '11'){
    time = '23:' + mid
  }

  return time
}

$('body').on('click', '.s',function(){
  //console.log('sclicked')
build_search()

})
$('body').on('click', '.sa',function(){
  $('body').css('background-image', 'none');
  $('body').append('<img  src="aa.png" id="logo" alt="american account logo" >')
//  $('body').css('background-image', 'url(' + encodeURIComponent('bg.jpg') + ')');
  $('body').css('background', 'linear-gradient(rgba(255, 255, 255, 0),rgba(255, 255, 255, 1)),url("bg.jpg")')
  $('body').css('background-size', '75vw 80vh')
  $('body').css('outline', 'none')
  $('body').css('background-repeat', 'no-repeat')
  $('body').css('background-position', '50% 20%')
build_search()

})

//when you click on update tab hide the search stuff and make it the active tab
$('body').on('click', '.t',function() {
//empty out the body and make a new interface
    $('body').empty();
    $(".ticket_div").empty();
    $('body').css('background-image', 'none');
    $('body').append('<img  src="aa.png" id="logo-up" alt="american account logo" >')
    $('body').css('background-image', 'url(' + encodeURIComponent('bg2.jpg') + ')');
//$('body').css('background-size: cover; background-position: center; width: 100%; height 100%; background-repeat: no-repeat;')
    $('body').css('background-size', 'cover')
    $('body').css('background-position', '0% 2%')
    $('body').css('width', '95%')
    $('body').css('height', '105%')
    $('body').css('background-repeat', 'no-repeat')
    $('body').append('<div class= "new_nav"><button class="sa">Search for a Flight</button><button class="active t ss" >Update a Ticket</button><button class="p sb">Add Itinerary</button></div><br> ');
    $('.new_nav').append('<div class="ticket_div"></div>');
    //adds the new search boxes to page
    $(".ticket_div").append('<input type="text" class="search_tix" id="Flight" placeholder="Enter Flight Number">');
    $(".ticket_div").append('<input type="text" class="search_tix" id="Row" placeholder="Enter Row Number">');
    $(".ticket_div").append('<input type="text" class="search_tix" id="Seat" placeholder="Enter Seat Number">');
    $(".ticket_div").append('<input type="text" class="search_tix" id="Date" placeholder="Enter Date of Flight">');
    $(".ticket_div").append('<button class="sub_tix x">Search</button>');

    $("body").on("click", ".sub_tix", function(){

        var flight_number = $("#Flight").val();
        var seat_number = $("#Seat").val();
        var rownum = $("#Row").val();
        rownum = rownum.toUpperCase();
        var date = $("#Date").val();
        $(".ticket_div").empty();
        $.ajax(root_url + '/flights?filter[number]=' + flight_number,
            {
                type: 'GET',
                xhrFields: {withCredentials: true},

                success: (response) => {

                    if(response){
                        var flight=response[0];
                        var id = flight.id;
                        var plane = flight.plane_id;
                        var map;
                        $.ajax(root_url +'/planes/'+plane,
                            {
                                type:'GET',
                             xhrFields:{withCredentials:true},
                                success:(response)=>{
                                    map = response;
                                    map = response.seatmap_url;
                                    console.log(map);
                                }});
                        let i = $("<img url="+ encodeURI(map) + "alt='Seat Map'>");
                        $(".ticket_div").append(i);
                        console.log(i);
                        $.ajax(root_url +'/instances?filter[flight_id]='+id+"&filter[date]="+date,
                            {
                                type: 'GET',
                                xhrFields:{withCredentials:true},

                                success: (response) =>{
                                    if(response[0].id!=null){
                                        var instance = response[0];
                                        var instanceid = instance.id;
                                        $.ajax(root_url + '/seats?filter[number]='+seat_number + "&filter[row]="+rownum+"&filter[plane_id]="+ plane,
                                            {
                                                type: 'GET',
                                                xhrFields: {withCredentials: true},

                                                success: (response) => {
                                                    if (response) {
                                                        var seat = response[0];
                                                        var seatid = seat.id;
                                                        var cabin = seat.cabin;

                                                        $.ajax(root_url + '/tickets?filter[instance_id]=' + instanceid + "&filter[seat_id]=" + seatid,
                                                            {
                                                                type: 'GET',
                                                                dataType: 'json',
                                                                xhrFields: {withCredentials: true},

                                                                success: (response) => {
                                                                    if (!(response.length == 0)) {

                                                                        var ticket = response[0];
                                                                        var ticketid = ticket.id;
                                                                        var firstname = ticket.first_name;
                                                                        var middlename = ticket.middle_name;
                                                                        var lastname = ticket.last_name;
                                                                        var price_paid = ticket.price_paid;
                                                                        createTicketTable(firstname, middlename, lastname, flight_number, cabin, price_paid);
                                                                        $.ajax(root_url + '/tickets?filter[instance_id]=' + instanceid,
                                                                            {
                                                                                type: 'GET',
                                                                                dataType: 'json',
                                                                                xhrFields: {withCredentials: true},
                                                                                success: (response) => {
                                                                                    var tickets = response;
                                                                                    var ticketids = new Array();
                                                                                    for (let i = 0; i < tickets.length; i++) {
                                                                                        ticketids[i] = tickets[i].seat_id;
                                                                                    }
                                                                                    var seats = new Array();
                                                                                    var seatids = new Array();
                                                                                    $.ajax(root_url + '/seats?filter[plane_id]=' + plane,
                                                                                        {
                                                                                            type: "GET"
                                                                                            , dataType: 'json',
                                                                                            xhrFields: {withCredentials: true},
                                                                                            success: (response) => {
                                                                                                seats = response;
                                                                                                for (let i = 0; i < seats.length; i++) {
                                                                                                    seatids[i] = seats[i].id;
                                                                                                }
                                                                                                var openSeats = arr_diff(ticketids, seatids);
                                                                                                if ((openSeats == undefined) || (openSeats.length == 0)) {
                                                                                                    $(".ticket_div").append("<div class='openSeats' id='fullFlight'>No Empty Seats Found</div>");
                                                                                                }
                                                                                                else {
                                                                                                    createOpenSeats(ticketid, firstname, lastname, openSeats, instanceid, plane);
                                                                                                }
                                                                                            }
                                                                                        });
                                                                                }

                                                                            });
                                                                    }
                                                                    else {
                                                                        $(".ticket_div").empty();
                                                                        $(".ticket_div").append("<div Class='openSeat' style='float: top'>No Tickets Found");
                                                                    }
                                                                }

                                                            });
                                                    }


                                                    else{
                                                        $(".ticket_div").append("<div>Invalid Seat Number</div>");
                                                    }
                                                }
                                            });
                                    }
                                }
                            });
                    }
                    else{
                        $(".ticket_div").append("<div class=''>No Flights Found");
                    }
                }

            })


    });





})






//displays all the information on the table
function createTicketTable(firstname, middlename, lastname, flight_number, cabin, price_paid){
    console.log(firstname);
    $(".ticket_div").empty();
    let tixtable = $("<table class='ticket_table'><tr><th>Name</th><th>Flight Number</th><th>Price</th><th>Class</th></tr>");
    let info = $('<tr><td>'+firstname+" "+middlename+" "+lastname+'</td><td>'+flight_number+'</td><td>'+price_paid+'</td><td>'+cabin+'</td></tr>');
    tixtable.append(info);
    $(".ticket_div").append(tixtable);
}
//adds the available seats to the view
function createOpenSeats (ticketid, firstName, lastName, openSeats){
    console.log('made it');
    let op = $('<div class="opens_div" id="openDiv"></div>');
    let wt= $('<h2 class="openseatstitle" id="WindowSeatsTitle">Available Window Seats</h2>');
    wt.append("<div class='openSeats' id='WindowSeats'></div>");
    op.append(wt);
    let at = $('<h2 class="openseatstitle" id="AisleSeatsTitle">Available Aisle Seats</h2>');
    at.append("<div class='openSeats' id='AisleSeats'></div>");
    op.append(at);
    let et = $('<h2 class="openseatstitle" id="ExitSeatsTitle">Available Exit Row Seats</h2>');
    et.append('<div class = "openSeats" id="ExitSeats"></div>');
    op.append(et);
    console.log(op);
    let ut = $('<h2 class="openopenseatstitle" id="UpgradeSeatsTitle">Available Seats in Upgraded Cabins </h2>');
    ut.append('<div class="openSeats" id="UpgradeSeats"></div>');
    op.append(ut);
    console.log(op);
    $(".ticket_div").append(op);
    for(let i=0; i<openSeats.length; i++) {
        $.ajax(root_url + "/seats/" + openSeats[i], {
                type: "GET", dataType: 'json', xhrFields: {withCredentials: true},
                success: (response) => {
                    opens = response;
                    if (opens.is_aisle == true) {
                        let a = $('<div class="openSeatsChoice" id='+opens.row+opens.number+'>' + opens.row + opens.number + " " + opens.cabin + '</div>');
                        a.on("click",function () {
                            $.ajax(root_url + "/tickets/" + ticketid,
                                {
                                    type: 'PATCH',
                                    dataType:'json',
                                    data: {
                                        'ticket':{     "seat_id": openSeats[i]}},
                                    xhrFields: {withCredentials: true},
                                    success: (response) => {
                                        $(".ticket_div").empty();
                                        $(".ticket_div").append("<div>Upgrade Successful! To upgrade again, please click upgrade tickets</div>");
                                    }
                                });
                                });
                        $("#AisleSeats").append(a);
                    }

                    if (opens.is_window == true) {
                        let a = $('<div class="openSeatsChoice" id='+opens.row+opens.number+'>' + opens.row + opens.number + " " + opens.cabin + '</div>');
                        a.on("click",function () {
                            $.ajax(root_url + "/tickets/" + ticketid,
                                {
                                    type: 'PATCH',
                                    dataType:'json',
                                    data: {
                                        'ticket':{     "seat_id": openSeats[i]}},
                            xhrFields: {withCredentials: true},
                            success: (response) => {
                                $(".ticket_div").empty();
                                $(".ticket_div").append("<div>Upgrade Successful! To upgrade again, please click upgrade tickets</div>");
                            }
                        });
                        });
                        $("#WindowSeats").append(a);
                    }
                    if (opens.is_exit == true) {
                        let a = $('<div class="openSeatsChoice" id='+opens.row+opens.number+'>' + opens.row + opens.number + " " + opens.cabin + '</div>');
                       a.on("click",function () {
                            $.ajax(root_url + "/tickets/" + ticketid,
                                {
                                    type: 'PATCH',
                                    dataType:'json',
                                    data: {
                                        'ticket':{     "seat_id": openSeats[i]}},
                            xhrFields: {withCredentials: true},
                            success: (response) => {
                                $(".ticket_div").empty();
                                $(".ticket_div").append("<div>Upgrade Successful! To upgrade again, please click upgrade tickets</div>");
                            }
                        });
                        });
                        $("#ExitSeats").append(a);
                    }
                    if (opens.cabin != "Economy") {
                        let a = $('<div class="openSeatsChoice" id='+opens.row+opens.number+'>' + opens.row + opens.number + " " + opens.cabin + '</div>');
                        a.on("click",function () {
                            $.ajax(root_url + "/tickets/" + ticketid,
                                {
                                    type: 'PATCH',
                                    dataType:'json',
                            data: {
                                   'ticket':{     "seat_id": openSeats[i]}},
                            xhrFields: {withCredentials: true},
                            success: (response) => {
                                $(".ticket_div").empty();
                                $(".ticket_div").append("<div>Upgrade Successful! To upgrade again, please click upgrade tickets</div>");
                            }
                        });
                        });
                        $("#UpgradeSeats").append(a);
                    }
                }
            }
        );
    }
}
function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i <= 6; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
  });
