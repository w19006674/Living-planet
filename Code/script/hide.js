$(document).ready(function () {
    console.log('Document is ready');

    // Initially hide the headers
    $("#devToggle").hide();
    $("#toolsToggle").hide();
    $("#resourcesToggle").hide();
    $("#apiToggle").hide();

    // Toggle visibility on header click
    $("#dev-header").click(function () {
        console.log('dev-header clicked');
        $("#devToggle").slideToggle();
    });
    $("#tools-header").click(function () {
        console.log('tools-header clicked');
        $("#toolsToggle").slideToggle();
    });
    $("#resources-header").click(function () {
        console.log('resources-header clicked');
        $("#resourcesToggle").slideToggle();
    });
    $("#api-header").click(function () {
        console.log('api-header clicked');
        $("#apiToggle").slideToggle();
    });

    // Air quality button toggle
    $('#airToggle').click(function(){
        console.log('airToggle clicked');
        $('.air-container').slideToggle();
    });
});
