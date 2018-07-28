<template>
    <div class="container">
        <ul class="nav nav-tabs mb-3" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" v-bind:href="'#data' + index" v-bind:data-tab="'data' + index">Data</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" :href="'#options'+index" v-bind:data-tab="'options' + index">Options</a>
            </li>
            <li class="nav-item">
                <a class="item" title="Remove Dataset" @click="removeDataset(dataset)"><i class="fas fa-trash"></i></a>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane show active" :id="'data' + index" v-bind:data-tab="'data' + index">
                <form class="form-inline">
                    <div class="row justify-content-start">
                        <div class="col" v-for="(data,index) in dataset.data" :key="index">
                            <input @keyup.enter="addData(dataset)" v-model="dataset.data[index]" type="text">
                            <i class="fas fa-trash" @click="removeData(dataset, data)"></i>
                        </div>
                    </div>
                </form>
                <div class="row" style="padding:10px">
                    <button class="btn btn-info" @click="addData(dataset)" type="button"> +data</button>
                </div>
            </div>
            <div class="tab-pane" :id="'options' + index" v-bind:data-tab="'options' + index">
                <div class="row justify-content-start">
                    <div class="col-md-4">
                        <div class="field">
                            <label>Category</label>
                            <input v-model="dataset.label" type="text">
                        </div>
                        <div class="field">
                            <label>Background Color</label>
                            <input v-model="dataset.backgroundColor" type="color">
                        </div>
                        <div class="field">
                            <label>Border Color</label>
                            <input v-model="dataset.borderColor" type="color">
                        </div>
                        <div class="field">
                            <label>Border Width</label>
                            <input class="custom-range" type="range" min=1 max=10 value=5 v-model.number="dataset.borderWidth">
                        </div>
                        <div class="field" v-if="'line' == this.type">
                            <label>Fill</label>
                            <input type="checkbox" v-model="dataset.fill">
                        </div>
                        <div class="field" v-if="'line' == this.type">
                            <label>Point Background</label>
                            <input type="color" v-model="dataset.pointBackgroundColor">
                        </div>
                        <div class="field" v-if="'line' == this.type">
                            <label>Point Border</label>
                            <input type="color" v-model="dataset.pointBorderColor">
                        </div>
                        <div class="field" v-if="'line' == this.type">
                            <label>Point Hover Background</label>
                            <input type="color" v-model="dataset.pointHoverBackgroundColor">
                        </div>
                        <div class="field" v-if="'line' == this.type">
                            <label>Point Hover Border</label>
                            <input type="color" v-model="dataset.pointHoverBorderColor">
                        </div>
                        <div class="field" v-if="'line' == this.type">
                            <label>Point Radius</label>
                            <input class="custom-range" type="range" min=1 max=15 value=1 v-model.number="dataset.pointRadius">
                        </div>
                        <div class="field" v-if="'line' == this.type">
                            <label>Point Border Width</label>
                            <input class="custom-range" type="range" min=1 max=15 value=1 v-model.number="dataset.pointBorderWidth">
                        </div>
                        <div class="field" v-if="'line' == this.type">
                            <label>Line Tension</label>
                            <input type="text" v-model.number="dataset.lineTension">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Dataset',
        props: ['dataset', 'index', 'type', 'chartdata'],
        data() {
            return {
            }
        },
        methods: {
            addData: function (dataset) {
                dataset.data.push('');
            },
            removeData: function (dataset, data) {
                let index = dataset.data.indexOf(data);
                dataset.data.splice(index, 1);
            },
            removeDataset: function (datasets) {
                console.log(index);
                let index = this.chartdata.data.datasets.indexOf(datasets)
                this.chartdata.data.datasets.splice(index, 1)
            }
        },
        mounted: function () {
            //$('.menu .item').tab();
        }
    }
</script>
