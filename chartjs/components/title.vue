<template>
    <div class="fields">
        <div class="one wide field">
            <label>Show</label>
            <input type="checkbox" v-model="chartdata.options.title.display">
        </div>
        <div class="fields" v-if="chartdata.options.title.display">
            <div class="one field">
                <label>Text</label>
                <input type="text" v-model="chartdata.options.title.text">
            </div>
            <div class="one field">
                <label>Position</label>
                <select class="ui fluid search dropdown" v-model="chartdata.options.title.position">
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                </select>
            </div>
            <div class="one field">
                <label>Full Width</label>
                <input type="checkbox" v-model="chartdata.options.title.fullWidth">
            </div>
            <div class="one field">
                <label>Font Color</label>
                <input type="color" v-model="chartdata.options.title.fontColor">
            </div>
            <div class="one field">
                <label>Font Family</label>
                <input type="text" v-model="chartdata.options.title.fontFamily">
            </div>
            <div class="one field">
                <label>Font Size</label>
                <input class="custom-range" type="range" min=1 max=50 value=5 v-model.number="chartdata.options.title.fontSize">
            </div>
            <div class="one field">
                <label>Font Style</label>
                <select class="ui fluid search dropdown" v-model="chartdata.options.title.fontStyle">
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                    <option value="bold">Bold</option>
                    <option value="oblique">Oblique</option>
                    <option value="initial">Initial</option>
                    <option value="inherit">Inherit</option>
                </select>
            </div>
            <div class="one field">
                <label>Padding</label>
                <input class="custom-range" type="range" min=1 max=10 value=5 v-model.number="chartdata.options.title.padding">
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'titleOptions',
        props: ['chartdata']

    }
</script>
