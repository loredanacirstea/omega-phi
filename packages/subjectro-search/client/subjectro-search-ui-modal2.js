var langs = { 
    'en': { 'en': 'English', 'ro': 'Romanian', 'code':'Code'},
    'ro': { 'en': 'Engleza', 'ro': 'Romana', 'code': 'Cod'},
    'code': { 'en': 'English', 'ro': 'Romanian', 'code': 'Code'}
}

var lang = 'en'
var host = 'http://orobo.go.ro:5500'
var baseurl = host + '/api/subject/search?limit=15'
var selected

Template.subjectroSearchModal2.onRendered(function() {
  //setLangChooser(lang)
  //setSubject(lang)
  
  Meteor.setTimeout(function() {
    $('.showModal.sr').on('click', showModal)
    $('#subjectroChooserInput').on('keyup', setDropdown)
    $('#subjectroChooserSave').on('click', chooseSubject)
    $('#subjectroChooserSave').on('click', retrieveSelected)
  }, 3000)
})





function capitalize1(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
}

function setLangChooser (language) {
    if(!language)
        language = lang
    $('#languageChooser').html('')
    $('#languageChooser').append('<select>')
    for(l in langs[language])
        $('#languageChooser select').append('<option value="' + l + '">' + langs[language][l] + '</option>')

    $('#languageChooser select').on('change', function(e) {
        lang = $(e.currentTarget).val()
        //setSubject(lang)
    })
    
    console.info("Language chooser set.")
}

function setSubject(language, elem) {
    if(!language)
        language = lang
    var codes = [], cc
    $('label[data-id]').map(function() {
        cc = $(this).data('id').split(',')
        cc.forEach(function(code) {
            if(code && codes.indexOf(code) == -1)
                codes.push(code)
        })
    })
    $(".sr>input[type=hidden]").map(function() {
        cc = $(this).val().split(',')
        cc.forEach(function(code) {
            if(code && codes.indexOf(code) == -1)
                codes.push(code)
        })
    })
    var url = 'http://orobo.go.ro:4000/translate/code/' + language + '/' + codes.join(',') + '?sep=,'
    $.getJSON(url, function(data) {
        var ind, cc, res = []
        $('label[data-id]').map(function() {
            res = []
            cc = $(this).data('id').split(',')
            cc.forEach(function(code) {
                ind = codes.indexOf(code)
                if(ind != -1)
                    res.push(capitalize1(data[ind]))
            })
            $(this).html(res.join(','))
        })
        $(".sr>input[type=hidden]").map(function() {
            res = []
            cc = $(this).val().split(',')
            cc.forEach(function(code) {
                ind = codes.indexOf(code)
                if(ind != -1) {
                    res.push(capitalize1(data[ind]))
                }
            })
            $(this).siblings('input.sr.viz').val(res.join(','))
            $(this).siblings('div.sr.viz').html(res.join(','))
        })
    })
    
}

function simpleDrop(parent) {
    parent.append('<div id="subjectroSearchDrop" class="ui selection dropdown subjectroSearchDrop"><input type="hidden" name="subjectroSearchHidden"><i class="dropdown icon"></i><div class="default text">...</div><div class="menu" id="subjectroChooserMenu"></div></div>')
}

function multipleDrop(parent) {
    parent.append('<select id="subjectroSearchDrop" class="ui selection dropdown" multiple=""></select>')
}

function showModal(e) {
    console.log('showModal')
    selected = $(e.currentTarget)
    $('#subjectroChooserDrop').html('')
    var type, val
    if($(e.currentTarget).hasClass('m')) {
        multipleDrop($('#subjectroChooserDrop'))
    }
    else if($(e.currentTarget).hasClass('s')){
        simpleDrop($('#subjectroChooserDrop'))
    }
    if($(e.currentTarget).hasClass('editor')) {
        if(!$('#subjectroChooserModalEditor')[0]) {
            $('#modalDivContent').append('<textarea id="subjectroChooserModalEditor"></textarea>')
            $('#subjectroChooserModalEditor').html(selected.siblings('.editablediv').html())
            tinymce.init({
                selector: '#subjectroChooserModalEditor',
                auto_focus: 'subjectroChooserModalEditor',
                plugin: 'a_tinymce_plugin',
                a_plugin_option: true,
                a_configuration_option: 400,
                theme: 'modern',
                width: 600,
                height: 200,
                plugins: [
              'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
              'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
              'save table contextmenu directionality emoticons template paste textcolor'
            ],
                /*setup: function(ed){
                    ed.on("init", function(ed) {
                        var cont = selected.siblings('.editablediv').html()
                        console.log(cont)
                        console.log(ed.target.getBody())
                        console.log(ed.target.getContent())
                        ed.target.setContent(cont);
                        tinymce.execCommand('mceRepaint');
                        
                        console.log(ed.target.getContent())
                    });
                }*/
            });
        }
        /*window.setTimeout(function() {
            console.log(selected.siblings('.editablediv').html())
            tinymce.get('subjectroChooserModalEditor').setContent(selected.siblings('.editablediv').html())
            //tinymce.activeEditor.setContent(selected.siblings('.editablediv').html())
        }, 1500)*/
    }
    else if($('#subjectroChooserModalEditor')[0]) {
        tinymce.activeEditor.destroy()
        $('#subjectroChooserModalEditor').remove()
    }
    if($(e.currentTarget).hasClass('svg')) {
        $('#modalDivContent').append('<div id="subjectroSVGChooser><div id="subjectroSVGFile" class="ui selection dropdown"><input type="hidden" name="subjectroSVGFileHidden"><i class="dropdown icon"></i><div class="default text">...</div><div class="menu" id="subjectroSVGFileMenu"></div></div><div id="subjectroSVGSelect></div></div>')
        svgs.forEach(function(svg) {
            $('#subjectroSVGFileMenu').append('<div class="item" data-value="' + svg.url + '">' + svg.label + '</div>')
        })
        $('#subjectroSVGFile').dropdown({
            onChange: function(value) {
                //console.log(value)
                $.get(value, function(data) {
                    $('#subjectroSVGSelect').append(data)
                })
            }
        })
    }
    else if($('#subjectroSVG')[0])
        $('#subjectroSVG').remove
    $('#subjectroChooserInput>input').val('')
    setSelected(e)
    $('#subjectroChooserModal').modal('show')   
    $('.dropdown').dropdown()
}

function setDropdown(e) {
    
    var val = $('#subjectroChooserInput>input').val()
    //console.log(val)
    var lg = selected.data('lang')
    var letters = selected.data('letters')
    letters = letters ? parseInt(letters) : 3
    if(val && val.length >= letters) {
        var url = baseurl + '&lang=' + lg + '&text=' + val
        $.getJSON( url, function(data){
            setSelected(e)
            data.forEach(function(d) {
                if($('#subjectroChooserMenu')[0])
                    $('#subjectroChooserMenu').append('<div class="item" data-value="' + d.uuid + '" data-id="' + d._id + '" data-name="' + d.subject + '" data-lang="' + d.lang + '">' + d.subject + '</div>')
                else
                    $('#subjectroSearchDrop').append('<option value="' + d.uuid + '">' + d.subject + '</option>')
            })
            $('#subjectroSearchDrop').dropdown('show')
        })
    }
}

setSelected = function(e) {
    if($('#subjectroChooserMenu')[0]) {
        $('#subjectroChooserMenu').html('')
        $('#subjectroSearchDrop').dropdown('clear')
    }
    else
        $('#subjectroSearchDrop').html('')
    var vals = selected.siblings(".sr>input[type=hidden]").val()
    if(!vals)
        return
    vals = vals.split(',')
    var lg = selected.data('lang') || lang
    vals.forEach(function(val) {
        $.getJSON(host+'/api/subject?uuid=' + val + '&lang='+lg, function(d) {
            if($('#subjectroChooserMenu')[0])
                $('#subjectroChooserMenu').append('<div class="item" data-value="' + d.uuid + '" data-id="' + d._id + '" data-name="' + d.subject + '" data-lang="' + d.lang + '">' + d.subject + '</div>')
            else
                $('#subjectroSearchDrop').append('<option value="' + d.uuid + '">' + d.subject + '</option>')

            window.setTimeout(function() {
              console.log(d.uuid)
                $('#subjectroSearchDrop').dropdown('set selected', d.uuid)
            }, 600)
        })
    })
}

function chooseSubject(e) {
    var val = $(e.currentTarget).parent().find('.subjectroSearchDrop').val()
}

function retrieveSelected() {
    var vals, drop = $('#subjectroSearchDrop')

    if(drop.attr('multiple')) {
        drop = drop.parent()
    }

    vals = drop.dropdown('get value')

    //console.log(vals)

    if(vals) {
        if(typeof vals == 'string')
            vals = vals.split(',')
        selected.siblings("input[type=hidden]").val('')
        selected.siblings("input.sr.viz").val('')
        vals.forEach(function(val) {
            var item = drop.dropdown('get item', val)
            $.getJSON(host + '/api/subject?uuid=' + val + '&lang='+lang, function(data) {
                var vall = selected.siblings("input[type=hidden]").val()
                var trans = selected.siblings('input.sr.viz').val()
                if(vall && vall != '')
                    vall += ','
                if(trans && trans != '')
                    trans += ','
                vall += val//data.subject
                trans += item.text()
                selected.siblings("input[type=hidden]").val(vall).trigger('change')
                selected.siblings('input.sr.viz').val(trans)
            })
        })
    }
    $('#subjectroChooserModal').modal('hide')
}