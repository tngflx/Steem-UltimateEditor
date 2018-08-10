<template>
    <div class="modal fade" id="search-modal" tabindex="-1" role="dialog" aria-labelledby="Search Modal" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="search-modal-title">Search</h4>
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>
                        From here you can search pictures, videos and citations. Enter
                        your search terms below.
                    </p>
                    <form role="form">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Search..." id="search-modal-query" v-model="Query" v-on:submit.prevent="onSubmit">
                        </div>
                    </form>

                    <section>
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12">
                                    <nav>
                                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                            <a class="nav-item nav-link active" id="nav-image-tab" @click="filtr = 'images'" data-toggle="tab" href="#nav-image" role="tab" aria-controls="nav-home" aria-selected="true">Images</a>
                                            <a class="nav-item nav-link" id="nav-videos-tab" @click="filtr = 'videos'" data-toggle="tab" href="#nav-videos" role="tab" aria-controls="nav-profile" aria-selected="false">Videos</a>
                                            <a class="nav-item nav-link" id="nav-scholar-tab" @click="filtr = 'scholar'" data-toggle="tab" href="#nav-scholar" role="tab" aria-controls="nav-home" aria-selected="true">Citation</a>
                                        </div>
                                    </nav>
                                    <div class="tab-content" id="nav-tabContent">
                                        <div class="tab-pane fade show active" id="nav-image" role="tabpanel" aria-labelledby="nav-home-tab">
                                            <searchResult ref="childResult" :Query="Query" v-if="filtr === 'images'" :filtr="filtr"/>
                                        </div>
                                        <div class="tab-pane fade" id="nav-videos" role="tabpanel" aria-labelledby="nav-profile-tab">
                                            <searchResult ref="childResult" :Query="Query" v-if="filtr === 'videos'" :filtr="filtr"/>
                                        </div>
                                        <div class="tab-pane fade" id="nav-scholar" role="tabpanel" aria-labelledby="nav-home-tab">
                                            <searchResult ref="childResult" :Query="Query" v-if="filtr === 'scholar'" :filtr="filtr"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div class="modal-footer">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import searchResult from './searchResult.vue'
    export default {
        components: {
            searchResult
        },
        data() {
            return {
                Query: '',
                filtr: 'images'
            }
        },
        watch: {
            Query: function () {
                const that = this;

                clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    that.fetchImages()
                }, 500);
            },

            filtr: function () {
                const that = this;

                clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    that.fetchImages()
                }, 500);
            }
        },
        methods: {
            fetchImages: function () {
                this.$refs.childResult.fetchImages();
            }
        }
    }
</script>
