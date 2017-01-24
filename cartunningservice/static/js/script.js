(function($, window) {

}).call(this, jQuery, window);

$(document).ready(function() {
    $('#createTaskForm')
        .find('[name="type"]')
            .selectpicker()
            .change(function(e) {
                $('#createTaskForm').formValidation('revalidateField', 'type');
            })
            .end()
        .find('[name="brand"]')
            .selectpicker()
            .change(function(e) {
                $('#createTaskForm').formValidation('revalidateField', 'brand');
            })
            .end()
        .find('[name="model"]')
            .selectpicker()
            .change(function(e) {
                /* Revalidate the language when it is changed */
                $('#createTaskForm').formValidation('revalidateField', 'model');
            })
            .end()
        .find('[name="engine"]')
            .selectpicker()
            .change(function(e) {
                /* Revalidate the language when it is changed */
                $('#createTaskForm').formValidation('revalidateField', 'engine');
            })
            .end()
        .find('[name="ecu"]')
            .selectpicker()
            .change(function(e) {
                /* Revalidate the language when it is changed */
                $('#createTaskForm').formValidation('revalidateField', 'ecu');
                $('#createTaskForm').formValidation('revalidateField', 'file');
            })
            .end()
        .formValidation({
            framework: 'bootstrap',
            excluded: ':disabled',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                type: {
                    validators: {
                        notEmpty: {
                            message: 'Please select vehicle type.'
                        }
                    }
                },
                brand: {
                    validators: {
                        notEmpty: {
                            message: 'Please select car brand.'
                        }
                    }
                },
                model: {
                    validators: {
                        notEmpty: {
                            message: 'Please select car model.'
                        }
                    }
                },
                engine: {
                    validators: {
                        notEmpty: {
                            message: 'Please select car engine.'
                        }
                    }
                },
                ecu: {
                    validators: {
                        notEmpty: {
                            message: 'Please select engine ecu type.'
                        }
                    }
                },
                file: {
                    validators: {
                        notEmpty: {
                            message: 'Please select ECU file.'
                        }
                        }
                    }
                }
        });
});

if( $('#type_select').length )         // use this if you are using id to check
{
    $("#type_select").ready(function() {
    var request = $.ajax({
        type: 'GET',
        headers: {"Authorization": "Token " + $.session.get('auth_token')},
        url: '/api/1.0/vehicles/',
    });
    request.done(function(data){
        var option_list = [["", "--- Select One ---"]].concat(data.data);

        $("#type_select").empty();
        for (var i = 0; i < option_list.length; i++) {
            $("#type_select").append(
                $("<option />").attr(
                    "value", option_list[i]['id']).text(option_list[i]['name'])
            );
        }
        $('#type_select').selectpicker("refresh");
    });
});

}

$("#type_select").change(function() {
    var vehicle_id = $(this).find(":selected").val();
    var request = $.ajax({
        type: 'GET',
        headers: {"Authorization": "Token " + $.session.get('auth_token')},
        url: '/api/1.0/vehicles/' + vehicle_id + '/brands/',
    });
    request.done(function(data){
        var option_list = [["", "--- Select One ---"]].concat(data.data);

        $("#brand_select").empty();
        for (var i = 0; i < option_list.length; i++) {
            $("#brand_select").append(
                $("<option></option>").attr(
                    "value", option_list[i]['id']).text(option_list[i]['name'])
            );
        }
        $('#brand_select').selectpicker("refresh");
        $('#model_select').empty();
        $('#model_select').selectpicker("refresh");
        $('#engine_select').empty();
        $('#engine_select').selectpicker("refresh");
        $('#ecu_select').empty();
        $('#ecu_select').selectpicker("refresh");
    });
});

$("#brand_select").change(function() {
    var brand_id = $(this).find(":selected").val();
    var request = $.ajax({
        type: 'GET',
        headers: {"Authorization": "Token " + $.session.get('auth_token')},
        url: '/api/1.0/brands/' + brand_id + '/models/',
    });
    request.done(function(data){
        var option_list = [["", "--- Select One ---"]].concat(data.data);

        $("#model_select").empty();
        for (var i = 0; i < option_list.length; i++) {
            $("#model_select").append(
                $("<option></option>").attr(
                    "value", option_list[i]['id']).text(option_list[i]['name'])
            );
        }
        $('#model_select').selectpicker("refresh");
        $('#engine_select').empty();
        $('#engine_select').selectpicker("refresh");
        $('#ecu_select').empty();
        $('#ecu_select').selectpicker("refresh");
    });
});

$("#model_select").change(function() {
    var model_id = $(this).find(":selected").val();
    var request = $.ajax({
        type: 'GET',
        headers: {"Authorization": "Token " + $.session.get('auth_token')},
        url: '/api/1.0/models/' + model_id + '/engines/',
    });
    request.done(function(data){
        var option_list = [["", "--- Select One ---"]].concat(data.data);

        $("#engine_select").empty();
        for (var i = 0; i < option_list.length; i++) {
            $("#engine_select").append(
                $("<option></option>").attr(
                    "value", option_list[i]['id']).text(option_list[i]['name'])
            );
        }
        $('#engine_select').selectpicker("refresh");
        $('#ecu_select').empty();
        $('#ecu_select').selectpicker("refresh");
    });
});

$("#engine_select").change(function() {
    var engine_id = $(this).find(":selected").val();
    var request = $.ajax({
        type: 'GET',
        headers: {"Authorization": "Token " + $.session.get('auth_token')},
        url: '/api/1.0/engines/' + engine_id + '/ecus/',
    });
    request.done(function(data){
        var option_list = [["", "--- Select One ---"]].concat(data.data);

        $("#ecu_select").empty();
        for (var i = 0; i < option_list.length; i++) {
            $("#ecu_select").append(
                $("<option></option>").attr(
                    "value", option_list[i]['id']).text(option_list[i]['name'])
            );
        }
        $('#ecu_select').selectpicker("refresh");
    });
});
