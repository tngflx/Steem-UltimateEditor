<template>
    <div class="modal fade" id="chart-builder" tabindex="-1" role="dialog" aria-labelledby="chart-builder" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" style="width:1300px;left:-400px">
                <div class="modal-header">
                    <h5 class="modal-title" id="chart-title">Chart builder</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body container-fluid" id="chart-modal-body">
                    <div class="row">
                        <div class="col-sm-6">
                            <div style="width:700px;height:450px;margin:0 auto 40px auto">
                                <canvas width="600" height="400" ref="newGraph" id="vueChart"></canvas>
                            </div>
                        </div>
                        <div class="col-sm-6 accordion-body" style="max-width:600px;left:58px">
                            <chartModBody :chartdata="chartData" :parentRefs="$refs" />
                        </div>
                    </div>
                </div>
                <div id="chart-builder-footer">
                    <div class="modal-footer" id="chart-modal-footer">
                        <button type="button" class="btn btn-primary" @click="toBlob" id="chart-export">Export to editor</button>
                        <button type="button" class="btn btn-secondary" id="chart-save">Save as image</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="chart-close">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //require("expose-loader?$!jquery");
    import chartModBody from './chartModBody';
    var type, data, options;

    type = JSON.parse(localStorage.getItem('type')) || 'bar';

    data = JSON.parse(localStorage.getItem('data')) || {

        labels: [],
        datasets: []

    };

    options = JSON.parse(localStorage.getItem('options')) || {
        title: {
            display: true,
            fullWidth: 20,
            fontColor: '',
            fontFamily: '',
            fontSize: '',
            fontStyle: '',
            padding: ''
        },
        legend: {
            display: true,
            fullWidth: true,
            labels: {
                boxWidth: 40,
                fontStyle: '',
                fontSize: 12,
                padding: 10
            }
        },
        plugins: {
            datalabels: {
                color: 'black',
                display: null,
                font: {
                    weight: 'bold'
                },
                formatter: null
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    export default {
        components: {
            chartModBody
        },
        props: ['chartdata', 'parentRefs'],
        data() {
            return {
                chartData: {
                    type: type,
                    data: data,
                    options: options
                },
                showCode: false
            }
        },
        methods: {
            toBlob: function () {
                let ctx = this.$refs.newGraph
                ctx.toBlob(
                    function (blob) {
                        // Do something with the blob object,
                        // e.g. creating a multipart form for file uploads:
                        if (blob) {
                            var fileName = 'chart-' + Date.now();
                            let formData = new FormData();
                            formData.append('files[]', blob, fileName);
                            this.uploadIPFS(formData);
                        }
                    }.bind(this),
                    'image/jpeg'
                );
            },
            uploadIPFS: function (formData) {
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
                        $(document).trigger('chartUploaded', [url, filename]);
                    },
                    error: function (err) {
                        iziToast.show({
                            title: 'Error occured!',
                            message: 'Unable to upload. Please try again later..',
                            position: 'topRight',
                            color: 'red',
                            icon: 'fas fa-exclamation-triangle'
                        });
                    }
                })
            }
        }
    }
</script>
