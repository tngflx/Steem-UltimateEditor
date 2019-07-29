<template>
    <div class="container">
        <div class="row">
            <div class="col col-xl-3 order-xl-1 col-lg-3 order-lg-1 col-md-12 order-md-2 col-sm-12  responsive-display-none">
                <div class="ui-block">

                    <div class="your-profile">
                        <div class="ui-block-title ui-block-title-small">
                            <h6 class="title">Your PROFILE</h6>
                        </div>

                        <div id="accordion" role="tablist" aria-multiselectable="true">
                            <div class="card">
                                <div class="card-header" role="tab" id="headingOne">
                                    <h6 class="mb-0">
                                        <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne" class="collapsed">
                                            Posts Moderation
                                            <svg class="olymp-dropdown-arrow-icon"><use xlink:href="svg-icons/sprites/icons.svg#olymp-dropdown-arrow-icon"></use></svg>
                                        </a>
                                    </h6>
                                </div>

                                <div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingOne" style="">
                                    <ul class="your-profile-menu">
                                        <li>
                                            <router-link :to="{ name : 'Gmod_report' }">Member-Reported Posts</router-link>
                                        </li>
                                        <li>
                                            <router-link :to="{ name : 'Gmod_report' }">Moderator-Reported Posts</router-link>
                                        </li>
                                        <li>
                                            <a href="32-YourAccount-EducationAndEmployement.html">Approval notifications</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="ui-block-title">
                            <a href="33-YourAccount-Notifications.html" class="h6 title">Polls</a>
                            <a href="#" class="items-round-little bg-primary">8</a>
                        </div>
                        <div class="ui-block-title">
                            <a href="34-YourAccount-ChatMessages.html" class="h6 title">Contests</a>
                        </div>
                        <div class="ui-block-title">
                            <a href="35-YourAccount-FriendsRequests.html" class="h6 title">Join Requests</a>
                            <a href="#" class="items-round-little bg-blue">4</a>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col col-xl-9 order-xl-2 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12">
                <router-view :groupID="groupID"></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import { getAvatarURL } from "../../../../../src/js/helpers/avatarurl";
    import { custom_json } from '../../../common/helpers/customJSON'
    import { mapGetters } from 'vuex'
    export default {
        name: 'groupSect',
        components: {
        },
        props: ['groupID'],
        data() {
            return {
            }
        },
        methods: {
            getAvatarURL,
            changeRole(assignee, role) {
                custom_json(this.groupID, 'addorupdate_role', { who: assignee, role }).then(r => {
                    console.log(r)
                })
            },
            removeRole() {
                custom_json(this.groupID, 'remove_role', { who: assignee, role }).then(r => {
                    console.log(r)
                })
            },
            leaveGroup() {
                custom_json(this.groupID, 'leave_group', { who: assignee, role }).then(r => {
                    console.log(r)
                })
            }
        },
        computed: {
            ...mapGetters({
                membersData: 'GROUP_DATA'
            })
        },
        mounted() {


        }
    }
</script>
<style scoped src="../../../common/css/main.min.css">
</style>

<style scoped>

    .src-image {
        display: none;
    }

    .members-card {
        overflow: hidden;
        position: relative;
        border: 1px solid #CCC;
        border-radius: 8px;
        text-align: center;
        padding: 0;
        background-color: #284c79;
        color: rgb(136, 172, 217);
    }

        .members-card .header-bg {
            /* This stretches the canvas across the entire hero unit */
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 70px;
            border-bottom: 1px #FFF solid;
            /* This positions the canvas under the text */
            z-index: 1;
        }

        .members-card .member-avatar {
            position: relative;
            margin-top: 15px;
            z-index: 100;
        }

            .members-card .member-avatar img {
                width: 100px;
                height: 100px;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                border-radius: 50%;
                border: 5px solid rgba(0,0,30,0.8);
            }

        .members-card .bottom.btn {
            border-radius: 50%;
            width: 32px;
            height: 32px;
            line-height: 18px;
        }
</style>
