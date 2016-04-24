"use strict";
$(document).ready(function () {
  $(window).on('load', function () {
    $.getJSON('ajax/test.json', function (data) {
      var items = [];

      $.each(data, function (key, val) {
        items.push('<li id="' + key + '" class="student__item"><span>' + val + '</span><i class="student__remove js_remove">✖</i></li>');
      });

      $('<ul/>', {
        'id': 'studentList',
        'class': 'student__list',
        html: items.join('')
      }).appendTo('.student__section-list');
      
      var options = [];

      $.each(data, function (key, val) {
        options.push('<option value="' + key + '" >' + val + '</option>');
      });
      
      $('<select/>', {
        'id': 'studentSelect',
        'class': 'student__team-select',
        html: options.join('')
      }).appendTo('.student__team-select-block');
    });
  });
  


  $(document).on('click', '#addStudent', showDialog);
  
  $(document).on('click', '.js_remove', removeStudent);
  
  $(document).on('click', '.js_add-to-team', addToTeam);
  
  // show dialog to add student 
  function showDialog() {
    var person = prompt("Введите имя студента", "");

    if (person != null) {
      var studentList = document.getElementById("studentList");
      var el = document.createElement('li');
      el.className = 'student__item';
      el.innerHTML = '<span>' + person + '</span>' + '<i class="student__remove js_remove">✖</i>';
      studentList.appendChild(el);      
      
      var studentOption = '<option>'+ person +'</option>';
      $('.student__team-select').append(studentOption);
    }
  }
  
  // remove student 
  function removeStudent(){
    var removedValue = $(this).closest('.student__item').find('span').text();
    $(this).closest('.student__item').remove();
    $('.student__team-list li').each(function(){
      if($(this).text(removedValue)){
        $(this).remove();
      }
    });
    $('.student__team-select option').each(function(){
      if($(this).text() == removedValue){
        $(this).remove();
      }
    });
        
  }
  
  // add student to team
  
  function addToTeam(){
    var el = $(this).closest('.student__team');
    
    var selectedStudent = el.find('.student__team-select :selected').text();
    var selectedValue = el.find('.student__team-select').val();

    el.find('.student__team-select :selected').remove();
    
    var studentTeam = el.find('.student__team-list');
    
    var studentTeamChild = '<li>'+ selectedStudent +'</li>';
    studentTeam.append(studentTeamChild);
    
    // insert table row
    var table = el.find('.student__team-table tbody');
    var tr = table.append($('<tr>'));
    var j;
    for (j = 0; j < 5; j++){
      table.find('tr:last-child').append($('<td></td>'))
    }
    
    table.find('tr:last-child td:first-child').text(selectedStudent);
    
    // find all team lists and remove selected value
    
    $('.student__team-select option').each(function(){
       if($(this).val() == selectedValue){
         $(this).remove();
       } 
    })
    
  }
  
  
  
    
    
    
  
  
  
  
  
    
    
    
  
  
  
  
  
  
  
  

});