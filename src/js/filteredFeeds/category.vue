<template>
    <div class="section">
        <!-- container -->
        <div class="container">
            <!-- row -->
            <div class="row">
                <div class="col-md-8">
                    <!-- row -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="section-title">
                                <h2 class="title">Hot News</h2>
                            </div>
                        </div>
                        <!-- post -->
                        <div class="col-md-6" v-for="(post,index) in hot_all.slice(0,4)">
                            <div class="post">
                                <a class="post-img" href="blog-post.html"><img :src="post.thumb" alt=""></a>
                                <div class="post-body">
                                    <div class="post-category">
                                        <a href="category.html">{{post.category}}</a>
                                    </div>
                                    <h3 class="post-title"><router-link :to="{ name: 'post', params: {type:'hot_all', index: index }}">{{post.title}}</router-link></h3>
                                    <ul class="post-meta">
                                        <li><a href="author.html">{{post.author}}</a></li>
                                        <li>{{post.last_update.split('T')[0]}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <!-- /post -->
                    </div>
                    <!-- /row -->
                    <!-- row -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="section-title">
                                <h2 class="title">Travel &amp; Destinations</h2>
                            </div>
                        </div>
                        <!-- post -->
                        <div class="col-md-4" v-for="(post,index) in trend_travel.slice(0,6)">
                            <div class="post post-sm">
                                <a class="post-img" href="blog-post.html"><img :src="post.thumb" alt=""></a>
                                <div class="post-body">
                                    <div class="post-category">
                                        <a href="category.html">{{post.category}}</a>
                                    </div>
                                    <h3 class="post-title title-sm">
                                        <router-link :to="{ name: 'post', params: {type:'trend_travel', index: index }}">
                                            {{post.title}}
                                        </router-link>
                                    </h3>
                                    <ul class="post-meta">
                                        <li><a href="author.html">{{post.author}}</a></li>
                                        <li>{{post.last_update.split('T')[0]}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <!-- /post -->
                    </div>
                    <!-- /row -->
                    <!-- row -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="section-title">
                                <h2 class="title">Health</h2>
                            </div>
                        </div>
                        <!-- post -->
                        <div class="col-md-4" v-for="(post,index) in trend_health.slice(0,6)">
                            <div class="post post-sm">
                                <a class="post-img" href="blog-post.html"><img :src="post.thumb" alt=""></a>
                                <div class="post-body">
                                    <div class="post-category">
                                        <a href="category.html">{{post.category}}</a>
                                    </div>
                                    <h3 class="post-title title-sm"><router-link :to="{ name: 'post', params: {type:'trend_health', index: index }}">{{post.title}}</router-link></h3>
                                    <ul class="post-meta">
                                        <li><a href="author.html">{{post.author}}</a></li>
                                        <li>{{post.last_update.split('T')[0]}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <!-- /post -->

                    </div>
                    <!-- /row -->
                    <!-- row -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="section-title">
                                <h2 class="title">Finance &amp; Cryptocurrency</h2>
                            </div>
                        </div>
                        <!-- post -->
                        <div class="col-md-4" v-for="(post,index) in trend_crypto.slice(0,6)">
                            <div class="post post-sm">
                                <a class="post-img" href="blog-post.html"><img :src="post.thumb" alt=""></a>
                                <div class="post-body">
                                    <div class="post-category">
                                        <a href="category.html">{{post.category}}</a>
                                    </div>
                                    <h3 class="post-title title-sm"><router-link :to="{ name: 'post', params: {type:'trend_crypto', index: index }}">{{post.title}}</router-link></h3>

                                </div>
                            </div>
                        </div>
                        <!-- /post -->
                    </div>
                    <!-- /row -->
                </div>
                <widgets />
            </div>
            <!-- /row -->
        </div>
        <!-- /container -->
    </div>
</template>

<script>
    import widgets from './widgets'
    import { renderFeeds } from '../../common/helpers/renderFeeds'

    export default {
        components: {
            widgets
        },
        data() {
            return {
       
                error: null,
                feedsNum: [] 
            }
        },
        created() {
            renderFeeds('hot_all', this)
            renderFeeds('trend_health', this)
            renderFeeds('trend_crypto', this)
            renderFeeds('trend_travel', this)
            renderFeeds('trend_science', this)
            this.loading = false;

            console.log(this.feedsNum)
        }
    }
</script>

<style scoped src="./css/category.css">
</style>
