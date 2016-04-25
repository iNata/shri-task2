"use strict";
$(document).ready(function () {
  // students' profile storage
  var studentArray = [];
  
  loadData(studentArray);
  
    
  $(document).on('click', '#addStudent', addStudent);
  
  $(document).on('click', '.js_remove', removeStudent);
  
  $(document).on('click', '.js_add-to-team', addToTeam);


  
  
  // load json data and insert into studentlist and team selects  
  function loadData(storage) {
    $.getJSON('ajax/test.json', function (data) {

      $.each(data.students, function (i, student) {
        storage.push({
          id: student.id,
          name: student.name
        });
      });      
    }).done(function(){
      renderStudentList(storage);
      renderTeamSelect(storage);
    });
  }  
    
  // RENDER TOTAL STUDENT LIST
  function renderStudentList(storage){
    var studentList = [];
    
    $.each(storage, function (index, value) {
      studentList.push('<li id="student-' + value.id + '" class="student__item"><span>' + value.name + '</span><i class="student__remove js_remove">✖</i></li>');
    });
    
    $('<ul/>', {
      'id': 'studentList',
      'class': 'student__list',
      html: studentList.join('')
    }).appendTo('.student__section-list');
  }
  
  // RENDER TEAM SELECT
  function renderTeamSelect(storage){
    var optionList = [];
    
    $.each(storage, function (index, value) {
      optionList.push('<option value="student-' + value.id + '" >' + value.name + '</option>');  
    });
    
    $('<select/>', {
      'id': 'studentSelect',
      'class': 'student__team-select',
      html: optionList.join('')
    }).appendTo('.student__team-select-block');
  } 
  
  // ADD STUDENT
  function addStudent() {
    var person = prompt("Введите имя студента", "");

    if (person != null) { 
      var studentList = document.getElementById('studentList');
      var el = document.createElement('li');
      var studentId = studentArray.length + 1;
      el.id = 'student-' +studentId; 
      el.className = 'student__item';
      el.innerHTML = '<span>' + person + '</span>' + '<i class="student__remove js_remove">✖</i>';
      studentList.appendChild(el);      
      
      var studentOption = '<option value="student-'+ studentId +'">'+ person +'</option>';
      $('.student__team-select').append(studentOption);
    }
    
    // add student to storage    
    var newStudent = {};
    newStudent.id = studentId.toString();
    newStudent.name = person;
    studentArray.push(newStudent);
    console.log(studentArray);    
    
  }
  
  // REMOVE STUDENT 
  function removeStudent(){
    var el = $(this);
    var removedValue = el.closest('.student__item').attr('id');       
    $('#'+removedValue).remove();
    var removedId = removedValue.split('-').pop();
    
    // remove also from team lists
    $('.student__team-list li').each(function(){
      var teamStudentIdAttr = $(this).attr('id');
      var teamStudentId = teamStudentIdAttr.split('-').pop();
      if(teamStudentId == removedId){
        $(this).remove();
      }
    });
    
    // remove also from student team table
    $('.student__team-table tbody tr').each(function (){        
        var teamRowIdAttr = $(this).attr('id');        
        var teamRowId = teamRowIdAttr.split('-').pop();
        if(teamRowId == removedId){
          $(this).remove();
        }           
    });
    
    $('.student__team-select option[value="'+removedValue+'"]').remove();
    
    //remove student from storage
    var removedId = removedValue.split('-').pop();    
    studentArray = $.grep(studentArray, function(o,i) { return o.id == removedId; }, true);
    console.log(studentArray); 
  }
  
  // ADD STUDENT TO TEAM  
  function addToTeam(){
    
    var el = $(this).closest('.student__team');
    var selectedOption = el.find('.student__team-select :selected');    
    var selectedStudent = selectedOption.text();    
    var selectedValue = el.find('.student__team-select').val();
    var selectedId = selectedValue.split('-').pop();

    selectedOption.remove();
    
    var studentTeam = el.find('.student__team-list'); 
    var studentTeamId = studentTeam.attr('id');
    var studentTeamChild = '<li id="' + studentTeamId + '-' + selectedId + '">' + selectedStudent + '</li>';
    studentTeam.append(studentTeamChild);

    // find all team lists and remove selected value    
    $('.student__team-select option').each(function(){
      var eachEl = $(this);
      var optionValue = eachEl.val();
      var optionId = optionValue.split('-').pop();
      if(optionId == selectedId){
        eachEl.remove();
      }
    });
    
    // insert table row
    var table = el.find('.student__team-table tbody');
    var tr = table.append($('<tr id="'+studentTeamId+'Row-'+selectedId+'">'));
    var j;
    for (j = 0; j < 5; j++){
      table.find('tr:last-child').append($('<td></td>'))
    }    
    table.find('tr:last-child td:first-child').text(selectedStudent); 
    
  }
  
  
  
    
    
    
  
  
  
  
  
    
    
    
  
  
  
  
  
  
  
  

});