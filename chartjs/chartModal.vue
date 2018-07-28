<template>
    <div class="ui form">
        <div class="inline fields">
            <div class="row justify-content-end" style="margin-bottom:20px;">
                <div class="col-sm-6">
                    <button @click="Example1" class="btn btn-info">Example 1</button>
                    <button @click="Example2" class="btn btn-info">Example 2</button>
                </div>
                <div class="col-sm-6">
                    <label>Chart Type</label>
                    <select class="ui dropdown" v-model="chartdata.type">
                        <option value="horizontalBar">Horizontal Bar</option>
                        <option value="bar">Bar</option>
                        <option value="line">Line</option>
                        <option value="radar">Radar</option>
                        <option value="polarArea">Polar Area</option>
                        <option value="pie">Pie</option>
                        <option value="doughnut">Doughnut</option>
                    </select>
                </div>
            </div>
            <div class="row" style="margin-bottom:10px">
                <div class="col-sm-6">
                    <button class="btn btn-success" @click="displayChart"><i class="fas fa-paint-roller" style="margin-right:10px"></i>Draw</button>
                </div>
            </div>
            <section id="graph-data-selector">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                                <div class="panel panel-default">
                                    <div class="panel-heading" role="tab" id="headingOne">
                                        <h4 class="panel-title">
                                            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#graph-label" aria-expanded="true" aria-controls="collapseOne">
                                                1. Set the labels
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="graph-label" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="firstHead">
                                        <div class="panel-body card">
                                            <form class="form-inline card-body">
                                                <div class="form-group" v-for="(label,index) in chartdata.data.labels" :key="index">
                                                    <input type="text" class="form-control" v-model="chartdata.data.labels[index]" placeholder="label" @keyup.enter="addLabel">
                                                    <i class="fas fa-trash" @click="deleteLab(label)"></i>
                                                </div>
                                            </form>
                                            <div class="field">
                                                <button class="btn btn-info" @click="addLabel"><i class="tag icon"></i>Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="panel panel-default">
                                    <div class="panel-heading" role="tab" id="headingTwo">
                                        <h4 class="panel-title">
                                            <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                2. Set the data in charts
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                                        <div class="panel-body card">
                                            <form class="form-inline card-body">
                                                <Dataset v-for="(dataset,index) in chartdata.data.datasets" :type="chartdata.type" :chartdata="chartdata" :index="index" :dataset.sync="dataset" :key="index" />
                                                <button class="btn btn-info" @click="addDataset" type="button"><i class="fas fa-database"></i>Add</button>
                                                <br>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="panel panel-default">
                                    <div class="panel-heading" role="tab" id="headingThree">
                                        <h4 class="panel-title">
                                            <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                3. Customize your charts
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                                        <div class="panel-body card">
                                            <ul class="nav nav-tabs mb-3" role="tablist">
                                                <li class="nav-item">
                                                    <a class="nav-link active" href="#chart-Title" data-toggle="tab" role="tab">Title</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="nav-link" href="#chart-legend" data-toggle="tab" role="tab">Legend</a>
                                                </li>
                                                <!--<li class="nav-item">
                                                    <a class="nav-link" href="#chart-tooltips" data-toggle="tab" role="tab">Tooltips</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="nav-link" href="#chart-animate" data-toggle="tab" role="tab">Animations</a>
                                                </li>-->
                                                <li class="nav-item">
                                                    <a class="nav-link" href="#chart-elements" data-toggle="tab" role="tab">Elements</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="nav-link" href="#chart-scales" data-toggle="tab" role="tab">Scales</a>
                                                </li>
                                            </ul>
                                            <div class="tab-content" style="width: 30rem;">
                                                <div class="card-body">
                                                    <div class="tab-pane active show" id="chart-Title">
                                                        <titleOptions :chartdata="chartdata" />
                                                    </div>
                                                    <div class="tab-pane" id="chart-legend" role="tabpanel">
                                                        <legendOptions :chartdata="chartdata" />
                                                    </div>
                                                    <div class="tab-pane" id="chart-tooltips" role="tabpanel">
                                                        <toolTipsOptions :chartdata="chartdata" />
                                                    </div>
                                                    <div class="tab-pane" id="chart-animate" role="tabpanel">
                                                        <AnimateOptions :chartdata="chartdata" />
                                                    </div>
                                                    <div class="tab-pane" id="chart-elements" role="tabpanel">
                                                        <ElOptions :chartdata="chartdata" />
                                                    </div>
                                                    <div class="tab-pane" id="chart-scales" role="tabpanel">
                                                        <scaleOptions :chartdata="chartdata" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    //import scaleOptions from './customization/scales';
    //import AnimateOptions from './customization/animate';
    //import toolTipsOptions from './customization/tooltips';
    import legendOptions from './customization/legend';
    import titleOptions from './customization/title';
    import Dataset from './customization/datasets';
    export default {
        components: {
            titleOptions, Dataset, legendOptions
        },
        props: ['chartdata', 'parentRefs'],
        data: function () {
            return {

            }
        },
        methods: {
            displayChart: function () {
                if (this.vueChart != null) {
                    this.vueChart.destroy();
                }
                let ctx = this.parentRefs.newGraph.getContext('2d');

                localStorage.setItem("type", JSON.stringify(this.chartdata.type));

                let data = {
                    labels: this.chartdata.data.labels,

                    datasets: this.chartdata.data.datasets
                };

                Chart.plugins.register({
                    beforeDraw: function (chartInstance) {
                        var ctx = chartInstance.chart.ctx;
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
                    }
                });

                Chart.defaults.global.plugins.datalabels.color = 'black';
                Chart.defaults.global.plugins.datalabels.font.size = '15';
                Chart.defaults.global.plugins.datalabels.font.weight = 'bold';

                this.vueChart = new Chart(ctx, {
                    type: this.chartdata.type,
                    data: this.chartdata.data,
                    options: this.chartdata.options
                });

            },

            Example1: function () {
                this.chartdata.type = 'pie',
                    this.chartdata.data = {

                        labels: [
                            "Saudi Arabia",
                            "Russia",
                            "Iraq",
                            "United Arab Emirates",
                            "Canada"
                        ],
                        datasets: [
                            {
                                data: [133.3, 86.2, 52.2, 51.2, 50.2],
                                backgroundColor: [
                                    "#FF6384",
                                    "#63FF84",
                                    "#84FF63",
                                    "#8463FF",
                                    "#6384FF"
                                ],
                                borderColor: "black",
                                borderWidth: 2
                            }
                        ]
                    };
                this.chartdata.options = {
                    legend: {
                        position: 'left'
                    },
                    title: {
                        display: true,
                        text: 'Predicted world population (millions) in 2050'
                    }
                }
                this.displayChart();
            },
            Example2: function () {
                this.chartdata.type = 'bar',
                    this.chartdata.data = {
                        labels: ["1900", "1950", "1999", "2050"],
                        datasets: [{
                            label: "Europe",
                            type: "line",
                            borderColor: "#8e5ea2",
                            data: [408, 547, 675, 734],
                            fill: false
                        }, {
                            label: "Africa",
                            type: "line",
                            borderColor: "#3e95cd",
                            data: [133, 221, 783, 2478],
                            fill: false
                        }, {
                            label: "Europe",
                            type: "bar",
                            backgroundColor: "rgba(0,0,0,0.2)",
                            data: [408, 547, 675, 734],
                        }, {
                            label: "Africa",
                            type: "bar",
                            backgroundColor: "rgba(0,0,0,0.2)",
                            backgroundColorHover: "#3e95cd",
                            data: [133, 221, 783, 2478]
                        }
                        ]
                    },
                    this.chartdata.options = {
                        title: {
                            display: true,
                            text: 'Population growth (millions): Europe & Africa'
                        },
                        legend: { display: false }
                    }
                this.displayChart();
            },

            addLabel: function () {
                this.chartdata.data.labels.push('');
            },

            deleteLab: function (label) {
                let index = this.chartdata.data.labels.indexOf(label)
                this.chartdata.data.labels.splice(index, 1)
            },

            addDataset: function () {
                this.chartdata.data.datasets.push({
                    label: '',
                    backgroundColor: '',
                    fill: true,
                    data: []
                });
            },

        },
        mounted: function () {
            this.$nextTick(function () {
                this.displayChart();
            })
        }
    }
</script>

<style scoped>
    #accordion .panel {
        border: none;
        border-radius: 0;
        box-shadow: none;
        /* margin: 0 30px 10px 30px;*/
        overflow: hidden;
        position: relative;
    }

    #accordion .panel-heading {
        padding: 0;
        border: none;
        border-radius: 0;
        position: relative;
    }


    #ex1Slider .slider-selection {
        background: #BABABA;
    }

    #accordion .panel-title a {
        display: block;
        padding: 15px 20px;
        margin: 0;
        background: #fe7725;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 1px;
        color: #fff;
        border-radius: 0;
        position: relative;
    }

        #accordion .panel-title a.collapsed {
            background: #1c2336;
        }

            #accordion .panel-title a:before,
            #accordion .panel-title a.collapsed:before {
                content: "\f068";
                font-family: fontawesome;
                width: 30px;
                height: 30px;
                line-height: 25px;
                border-radius: 50%;
                background: #fe7725;
                font-size: 14px;
                font-weight: normal;
                color: #fff;
                text-align: center;
                border: 3px solid #fff;
                position: absolute;
                top: 10px;
                right: 14px;
            }

            #accordion .panel-title a.collapsed:before {
                content: "\f067";
                background: #ababab;
                border: 4px solid #626262;
            }

            #accordion .panel-title a:after,
            #accordion .panel-title a.collapsed:after {
                content: "";
                width: 17px;
                height: 7px;
                background: #fff;
                position: absolute;
                top: 22px;
                right: 0;
            }

            #accordion .panel-title a.collapsed:after {
                width: 19px;
                background: #ababab;
            }

    #accordion .panel-body {
        border-left: 3px solid #fe7725;
        border-top: none;
        background: #fff;
        /*font-size: 15px;*/
        color: #1c2336;
        line-height: 27px;
        position: relative;
        margin-bottom: 10px;
        padding: 10px;
    }

        #accordion .panel-body:before {
            content: "";
            height: 3px;
            width: 50%;
            background: #fe7725;
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
        }

        #accordion .panel-body p {
            padding: 10px;
        }

    .ui.vertical.divider {
        color: #696969;
    }

    .ui.vertical.divider {
        margin: 0 4px;
    }

    .ui.raised.segment {
        background-color: #fffacd;
        width: 600px;
        margin-top: 0;
        position: fixed;
        left: 10px;
        top: 10px;
    }

    .snippet {
        background-color: #f5f5f5;
    }

    .nav-bar {
        margin-bottom: 30px;
    }
</style>
