'use strict';
const { Controller } = require('egg');

class ShowdataController extends Controller {
    async dataGather() {
        const { ctx } = this;
        await ctx.render('data-view.html');

    }

}

module.exports = ShowdataController;