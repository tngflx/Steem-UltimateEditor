<template>
    <div class="container">
        <div class="row" v-if="loading === false">
            <div class="row">
                <div class="col-lg-4 col-md-4 col-xs-6 thumb" v-for="(item,index) in items">
                    <a class="thumbnail" data-image-id="" data-toggle="modal" :data-image="item.thumbnail" @click="Export2Editor(item)">
                        <video class="content" width=230 height=154 style="max-height:154px;max-width:230px;" loop muted onmouseover="this.play()" onmouseout="this.pause();" :key="index" v-if="filtr === 'videos'">
                            <source :src="item.item_url">
                        </video>
                        <img class="img-thumbnail" width=230 height=154 :src="item.thumbnail" alt="Another alt text" v-if="filtr === 'images'">
                    </a>
                </div>
            </div>
        </div>
        <p></p>
        <p v-if="loading === 'notfound'">Nothing found, try other keywords..</p>
        <p v-if="loading === 'error404'">Connect to server failed, please try again later</p>
        <div class="loading-center-parent" v-show="loading === true">
            <div class="loading-center-container">
                <i class="fas fa-circle-notch fa-spin" style="font-size:60px"></i>
                <!--<div class="pixabay-banner">
                    Powered by : <img src="https://pixabay.com/static/img/logo_square.svg" />
                </div>-->
            </div>
        </div>
    </div>
</template>
<script>
    let query = {
        pagenum: 1,
        amount: 20,
        apiUrl: process.env.SERVER_URL + 'search',
        items: []
    }

    export default {
        props: ['Query', 'filtr'], //Query = search text, filtr = search by what type
        data() {
            return {
                items: [],
                loading: false,
                showVid: false
            }
        },
        methods: {
            fetchImages: function () {
                this.loading = true;
                let vm = this;

                if (this.filtr === 'images') {
                    $.ajax({
                        url: `${query.apiUrl}/?q=${this.Query}&filetype=images&per_page=${query.amount}&safesearch=true&page=${query.pagenum}`,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (r) {
                            if (parseInt(r.totalHits) > 0) {
                                const data = r.data;
                                vm.items = data.map(item => {
                                    return { thumbnail: item.previewURL, item_url: item.webformatURL, author: item.user, pageURL: item.pageURL }
                                })

                                vm.loading = false;
                            } else {
                                console.log('No hits');
                                vm.loading = 'notfound';
                            }
                        },
                        error: function (xhr) {
                            console.log(xhr.status);
                            vm.loading = 'error404';
                        }

                    })
                } else if (this.filtr === 'videos') {
                    this.fetchVideos()
                } else if (this.filtr === 'scholar') {
                    //this.fetchScholar()
                }

            },
            fetchVideos: function () {
                let vm = this;
                $.ajax({
                    url: `${query.apiUrl}/?q=${this.Query}&filetype=videos&per_page=${query.amount}&safesearch=true&page=${query.pagenum}`,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (r) {
                        if (parseInt(r.totalHits) > 0) {
                            const data = r.data;
                            vm.items = data.map(item => {
                                return { thumbnail: `https://i.vimeocdn.com/video/${item.picture_id}_295x166.jpg`, item_url: item.videos.tiny.url, author: item.user, pageURL: item.pageURL }
                            })
                            vm.loading = false;
                        } else {
                            console.log('No hits');
                            vm.loading = 'notfound';
                        }
                    },

                    error: function (e) {
                        console.log(e.msg);
                        vm.loading = 'error404';
                    }
                })
            },

            Export2Editor: function (item) {
                $(document).trigger('searchItemSelected', [item, this.filtr])

            }
        }
    }
</script>
<style scoped>
    .thumb {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .loading-center-parent {
        position: relative;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .loading-center-container {
        width: 60px;
        height: 60px;
        position: relative;
        top: 50%;
        left: 50%;
        margin-top: 4px;
        margin-right: 0;
        margin-bottom: 18px;
        margin-left: -30px;
        z-index: -1;
    }
</style>
