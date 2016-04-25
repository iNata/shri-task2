"use strict";
$(document).ready(function () {
  
  // students' profile storage
  var studentArray = [];
  
  // teachers' profile storage
  var teacherArray = [];
  
  loadStudentData(studentArray);
  loadTeacherData(teacherArray);
  
    
  $(document).on('click', '#addStudent', addStudent);
  
  $(document).on('click', '.js_remove', removeStudent);
  
  $(document).on('click', '.js_add-to-team', addToTeam);

  $(document).on('click', '.js_add-task', addTask);
  
  $(document).on('click', '.js_edit-task', editTask);
  
  $(document).on('click', '.js_add-group-task', addGroupTask);
  
  
  // load json data and insert into studentlist and team selects  
  function loadStudentData(storage) {
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
  
  // LOAD TEACHERS' DATA
  function loadTeacherData(storage){
    $.getJSON('ajax/test.json', function (data) {

      $.each(data.teachers, function (i, teacher) {
        storage.push({
          id: teacher.id,
          name: teacher.name
        });
      });
    }).done(function(){
      renderTeacherList(storage);      
    });
  }
  
  // RENDER TEACHER LIST
  function renderTeacherList(storage){
    var teacherList = [];

    $.each(storage, function (index, value) {
      teacherList.push('<li id="teacher-' + value.id + '" class="teacher__item"><span>' + value.name + '</span></li>');
    });

    $('<ul/>', {
      'id': 'teacherList',
      'class': 'teacher__list',
      html: teacherList.join('')
    }).appendTo('.teacher__section-list');
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
      
      // add student to storage    
      var newStudent = {};
      newStudent.id = studentId.toString();
      newStudent.name = person;
      studentArray.push(newStudent);
      console.log(studentArray);    
    }
    
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
    if(selectedOption.length){
      var selectedId = selectedValue.split('-').pop();
    }    

    selectedOption.remove();
    
    if(selectedOption.length){
      var studentTeam = el.find('.student__team-list');
      var studentTeamId = studentTeam.attr('id');
      var studentTeamChild = '<li id="' + studentTeamId + '-' + selectedId + '">' + selectedStudent + '</li>';
      studentTeam.append(studentTeamChild);
    }    

    // find all team lists and remove selected value    
    $('.student__team-select option').each(function(){
      var eachEl = $(this);
      var optionValue = eachEl.val();
      var optionId = optionValue.split('-').pop();
      if(optionId == selectedId){
        eachEl.remove();
      }
    });
    if(selectedOption.length) {
      // insert table row
      var table = el.find('.student__team-table tbody');
      var tr = table.append($('<tr id="' + studentTeamId + 'Row-' + selectedId + '">'));

      table.find('tr:last-child').append($('<td></td>' +
      '<td class="task-list">' +
      '</td><td class="task-mark"></td><td class="task-td__btn-wrapper"><button class="task-td__btn btn js_add-task">добавить задание</button></td>'));

      table.find('tr:last-child td:first-child').text(selectedStudent);
      
    }
  }
  
  // ADD TASK  
  function addTask(){
    var el = $(this);
    var wrapper = el.closest('tr').find('.task-list');
    
    wrapper.append('<div class="task-list__item">' +
      '<span class="task-content">Задание</span>'+
      '<input type="text" />' +
      '<span class="task-btn__edit js_edit-task"></span>' +
    '</div>');

    var wrapperMark = el.closest('tr').find('.task-mark');

    wrapperMark.append('<div class="task-mark__item">' +
      '<select>' +
        '<option>5</option>' +
        '<option>4</option>' +
        '<option>3</option>' +
        '<option>2</option>' +
        '<option>1</option>' +
      '</select>' +
    '</div>');
  }  
  

  //EDIT TASK
  function editTask(){
    var el = $(this);        
    el.hide();
    var task = el.closest('.task-list__item');
    var content = task.find('.task-content');
    var text = content.text();
    content.hide();    
    task.find('input').show().val(text).focus();
    
    task.find('input').blur(function(){
      var input = $(this);
      var newText = input.val();
      input.hide();
      content.show().text(newText);
      task.closest('.task-list__item').find('.task-btn__edit').show();
    });
    
  }
  
  
  //ADD GROUP TASK  
  function addGroupTask(){
    var el = $(this);
    var wrapper = el.closest('tr').find('.group-task__list');

    wrapper.append('<div class="group-task__item">' +
      '<span class="task-content">Задание</span>'+
      '<input type="text" />' +
      '<span class="group-task__edit js_edit-group-task"></span>' +
    '</div>');

    var wrapperMark = el.closest('tr').find('.group-task__mark');

    wrapperMark.append('<div class="group-task__mark-item">' +
      '<select>' +
        '<option>5</option>' +
        '<option>4</option>' +
        '<option>3</option>' +
        '<option>2</option>' +
        '<option>1</option>' +
      '</select>' +
    '</div>');
  }
  
    
    
    
  
  
  
  
  
    
    
    
  
  
  
  
  
  
  
  

});