var canvas = document.getElementById('canvas');
var memecvs = canvas.getContext('2d');

// When the user clicks on <span> (x), close the modal
var modal = document.getElementById("ex4");
document.getElementsByClassName("close")[0].onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 

window.onload = (function () {
    memecvs.beginPath();
    memecvs.rect(0,0, 600, 500);
    memecvs.fillStyle = "white";
    memecvs.fill();
    memecvs.fillStyle = '#2233333';
    memecvs.font = 70 + 'px impact';
    memecvs.textAlign = "center";
    memecvs.lineWidth = 2;
    wrapTopText(memecvs, "Upload image or choose from given below", canvas.width / 2, canvas.height / 3, canvas.width - 60, 70);
})

// Draw in canvas tag
lines = 0;
function draw(text1, text2, size1, size2, img) {
    /* draw something */
    if (img != undefined) {
        $('#aside').removeAttr('hidden');
        memecvs.shadowBlur = 10;
        memecvs.drawImage(img, 0, 0, canvas.width, canvas.height);
        memecvs.fillStyle = '#fff';
        memecvs.font = size1 + 'px impact';
        wrapTopText(memecvs, text1, canvas.width / 2, size1 - 5, canvas.width - 60, size1 - 10);
        memecvs.font = size2 + 'px impact';
        memecvs.font = 'impact';
        wrapBottomText(memecvs, text2, canvas.width / 2, canvas.height - lines * (size2 - 10) - 10, canvas.width - 60, size2 - 10);
    }
}

// Handle changes in text
$('.tb').each(function () {
    var elem = $(this);
    elem.data('oldVal', elem.val());
    elem.bind("propertychange change click keyup input paste", function (event) {
        if (elem.data('oldVal') != elem.val()) {
            elem.data('oldVal', elem.val());

            // Do action
            draw($('#text-box1').val(), $('#text-box2').val(), $('#size-font1').val(), $('#size-font2').val(), image);
        }
    });
});

_getBoxCoordinates: function(position, boxWidth, boxHeight){
				var posDesc = position.split(" ");
				
				var coordinates = [];
				if(posDesc.length == 2)
				{
					switch(posDesc[0])
					{
						case "center":
							coordinates[1] = parseInt(MG.originalSize[1] / 2, 10);
							break;
							
						case "bottom":
							coordinates[1] = MG.originalSize[1] - boxHeight;
							break;
							
						case "top":
						default:
							coordinates[1] = 0;
							break;
					}
					
					switch(posDesc[1])
					{
						case "center":
							coordinates[0] = parseInt(MG.originalSize[0] / 2, 10) - parseInt(boxWidth / 2, 10);
							break;
							
						case "right":
							coordinates[0] = MG.originalSize[0] - boxWidth;
							break;
							
						case "left":
						default:
							coordinates[0] = 0;
							break;
					}
				} else {
					coordinates[0] = coordinates[1] = 0;
				}
				
				return coordinates;
			},
 
			_normalizePosition: function(value){
				return value * (1 + 1 - MG.scale);
			},
			
			_strtoupper: function(text){
				return text.toUpperCase();
} 

function wrapTopText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' '),
        line = ' ',
        lineCount = 0,
        i,
        test,
        metrics;
    for (i = 0; i < words.length; i++) {
        test = words[i];
        metrics = context.measureText(test);
        while (metrics.width > maxWidth) {
            // Determine how much of the word will fit
            test = test.substring(0, test.length - 1);
            metrics = context.measureText(test);
        }
        if (words[i] != test) {
            words.splice(i + 1, 0, words[i].substr(test.length))
            words[i] = test;
        }
        test = line + words[i] + ' ';
        metrics = context.measureText(test);
        if (metrics.width > maxWidth && i > 0) {
            context.textAlign = "center";
            context.fillText(line, x, y);
            context.strokeText(line, x, y);
            line = words[i] + ' ';
            y += lineHeight;
            lineCount++;
        }
        else {
            line = test;
        }
    }
    context.textAlign = "center";
    context.fillText(line, x, y);
    context.strokeText(line, x, y);
}
function wrapBottomText(context, text, x, y, maxWidth, lineHeight) {

    var words = text.split(' '),
        line = ' ',
        lineCount = 0,
        i,
        test,
        metrics;

    for (i = 0; i < words.length ; i++) {
        test = words[i];
        metrics = context.measureText(test);
        while (metrics.width > maxWidth) {
            // Determine how much of the word will fit
            test = test.substring(0, test.length - 1);
            metrics = context.measureText(test);
        }
        if (words[i] != test) {
            words.splice(i + 1, 0, words[i].substr(test.length))
            words[i] = test;
        }
        test = line + words[i] + ' ';
        metrics = context.measureText(test);
        if (metrics.width > maxWidth && i > 0) {
            context.textAlign = "center";
            context.fillText(line, x, y);
            context.strokeText(line, x, y);
            line = words[i] + ' ';
            y += lineHeight;
            lineCount++;
        }
        else {
            line = test;
        }
    }
    lines = lineCount;
    context.textAlign = "center";
    context.fillText(line, x, y);
    context.strokeText(line, x, y);
}
// Download link
function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}

async function uploadIPFS(canvasId) {

    $.ajax({
        url: 'http://localhost:4000/upload',
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
            console.log(result.files[0])
            const url = result.files[0].url;
            const filename = result.files[0].name;
            var index = $('.meme-picker')[0].options.length;
            $('.meme-picker').append(`<option data-img-src="${url}" data-img-alt="${filename}" value="${index}">${filename}</option>`)
            $(".meme-picker").data('picker').destroy();
            $(".meme-picker").imagepicker();
            $(".meme-picker").data('picker').sync_picker_with_select();
        },
        error: function (error) {
            console.log("Something went wrong!");
        }
    })
    // Form data
    //var data = document.getElementById(canvasId).toDataURL();
}


document.getElementById('download').addEventListener('click', function () {
    downloadCanvas(this, 'canvas', 'meme.png');
}, false);
