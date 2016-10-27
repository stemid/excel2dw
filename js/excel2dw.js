function excel2dw(data, type, header) {
    var separator = '', 
        lines = data.split('\n'),
        fields = new Array(), 
        outData = '',
        fieldIndex = 0,
        linesIndex = 0,
        longestLine = 0,
        firstLine = true;

    if (type == 'CSV') {
        separator = ';';
    } else if (type == 'Paste') {
        separator = '\t';
    } else {
        return false;
    }

    // First split by line
    lines = data.split('\n');
    fields = new Array(); 
    firstLine = true;

    for (linesIndex=0; linesIndex < lines.length; linesIndex++) {
        fields = lines[linesIndex].split(separator);

        // Treat first line different if headers are provided
        if (header && firstLine) {
            firstLine = false;
            outData += '^';
            for (fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
                outData += fields[fieldIndex] + ' ^';
            }
            outData += '\n';
            continue;
        }

        // Continue with rest of lines
        outData += '|';
        for (fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            outData += fields[fieldIndex] + ' |';
        }
        outData += '\n';
    }

    return outData;
}

$(document).ready(function () {
    var formDiv = $('#ConvertForm'),
        resultsDiv = $('#results'),
        button = '<button class="btn btn-primary" id="StartOver">Börja om</button>';

    $('#ConvertForm').submit(function (event) {
        event.preventDefault();

        var $form = $(this),
            $inputs = $form.find('input textarea button'),
            input = $form.find('textarea[name=Input]').val(),
            inputType = $form.find('input[name=InputType]:checked', '#ConvertForm').val(),
            inputHeader = $form.find('input[name=InputHeader]:checked', '#ConvertForm').val(),
            dwData = '';

        if (!input.length) {
            return false;
        }

        if (inputHeader == 'on') {
            inputHeader = true;
        } else {
            inputHeader = false;
        }

        $inputs.prop('disabled', true);

        dwData = '';
        dwData = excel2dw(input, inputType, inputHeader);

        formDiv.addClass('hidden');

        resultsDiv.html('<p class="lead">Kopiera och klistra in tabellen i DokuWiki</p>\n<pre>' + dwData + '</pre>' + button);
        resultsDiv.removeClass('hidden');
        resultsDiv.show();

        $('#StartOver').on('click', function () {
            resultsDiv.addClass('hidden');
            formDiv.removeClass('hidden');
        });

        $inputs.prop('disabled', false);
    });
});
