$(".notif-search-form").on("keyup click input", function () {
    let val = $(this).val();
    //Export all div elements to a text and concat with id, removing all new lines
    let arr = [...Array(300)].map((_, i) => {
        return { value: $(`#data-${i}`).text().trim().toLowerCase(), id: `data-${i}` }
    });
    arr = arr.filter((r) => { return r.value.indexOf(val.toLowerCase()) != -1 }).map((arr) => { return arr.id })
    arr = '#' + arr.join(",#")

    if (val.length) {
        $(".notif-list").hide();
        $(arr).show();
    }
    else {
        $(".notif-list").show();
    }
});
