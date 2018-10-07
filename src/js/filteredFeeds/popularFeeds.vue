<template>

    <!-- header_section_wrapper -->
    <div class="section">
        <div class="loading" v-if="loading">Loading...</div>
        <div v-if="error" class="error">
            {{ error }}
        </div>
        <transition name="slide">
            <!--
              giving the post container a unique key triggers transitions
              when the post id changes.
            -->
            <!-- container -->
            <div class="container">
                <!-- row -->
                <div id="hot-post" class="row hot-post">
                    <div class="col-md-8 hot-post-left">
                        <!-- post -->
                        <div class="post post-thumb">
                            <a class="post-img" href="blog-post.html"><img :src="thumbnails[0]" alt=""></a>
                            <div class="post-body">
                                <div class="post-category">
                                    <a href="category.html">{{trend_all[0].category}}</a>
                                </div>
                                <h3 class="post-title title-lg"><router-link :to="{ name: 'post', params: {type:'trend_all', index: 0 }}">{{trend_all[0].title}}</router-link></h3>
                                <ul class="post-meta">
                                    <li><a href="author.html">{{trend_all[0].author}}</a></li>
                                    <li>{{trend_all[0].last_update.split('T')[0]}}</li>
                                </ul>
                            </div>
                        </div>
                        <!-- /post -->
                    </div>
                    <div class="col-md-4 hot-post-right">
                        <!-- post -->
                        <div class="post post-thumb">
                            <a class="post-img" href="blog-post.html"><img :src="thumbnails[1]" alt=""></a>
                            <div class="post-body">
                                <div class="post-category">
                                    <a href="category.html">{{trend_all[1].category}}</a>
                                </div>
                                <h3 class="post-title"><router-link :to="{ name: 'post', params: {type:'trend_all', index: 1 }}">{{trend_all[1].title}}</router-link></h3>
                                <ul class="post-meta">
                                    <li><a href="author.html">{{trend_all[1].author}}</a></li>
                                    <li>{{trend_all[1].last_update.split('T')[0]}}</li>
                                </ul>
                            </div>
                        </div>
                        <!-- /post -->
                        <!-- post -->
                        <div class="post post-thumb">
                            <a class="post-img" href="blog-post.html"><img :src="thumbnails[2]" alt=""></a>
                            <div class="post-body">
                                <div class="post-category">
                                    <a href="category.html">{{trend_all[2].category}}</a>
                                </div>
                                <h3 class="post-title"><router-link :to="{ name: 'post', params: {type:'trend_all', index: 2 }}">{{trend_all[2].title}}</router-link></h3>
                                <ul class="post-meta">
                                    <li><a href="author.html">{{trend_all[2].author}}</a></li>
                                    <li>{{trend_all[2].last_update.split('T')[0]}}</li>
                                </ul>
                            </div>
                        </div>
                        <!-- /post -->
                    </div>
                </div>
                <!-- /row -->
            </div>
            <!-- /container -->
        </transition>
    </div>

</template>

<script>
    import { renderFeeds } from '../../common/helpers/renderFeeds'
    export default {
        data() {
            return {
                trend_all: null,
                thumbnails: {},
                loading: true,
                error: null
            }
        },
        created() {
            renderFeeds('trend_all', this)
            this.loading = false;
        },
        methods: {

        }
    }

</script>

<style scoped src="./css/style.css">
</style>
