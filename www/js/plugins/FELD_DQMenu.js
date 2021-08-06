//=============================================================================
// FELD_DQMenu.js
//=============================================================================

/*:en
 * @plugindesc Alternative menu designed to act like Dragon Quest's menu.
 * @author Feldherren
 *
 * @help DQ Menu v1.0, by Feldherren (rpaliwoda AT googlemail.com)
 *
 * A Dragon Quest style menu for RPG Maker MV.
 *
 * Free for use with commercial projects, though I'd appreciate being contacted 
 * if you do use it in any games, just to know.
 *
 * @param No. status window actors
 * @desc How many actors the status window will display without scrolling
 * @default 3
 *
 * @param Status window actor width
 * @desc Width (in pixels) each actor takes up in menu status window
 * @default 144
 *
 * @param Show actor portraits
 * @desc Whether or not actor portraits are displayed in the menu status window (true/false)
 * @default false
 *
 * @param Show HP gauges
 * @desc Whether or not HP gauge is displayed in the menu status window (true/false)
 * @default false
 *
 * @param Show MP gauges
 * @desc Whether or not MP gauge displayed in the menu status window (true/false)
 * @default false
 */

(function() {

    function toNumber(str, def) {
        return isNaN(str) ? def : +(str || def);
    }

    var parameters = PluginManager.parameters('FELD_DQMenu');
    var statusWindowActorsNumber = toNumber(parameters['No. status window actors'], 3);
    var statusWindowActorWidth = toNumber(parameters['Status window actor width'], 144);
    var showPortraits = parameters['Show actor portraits'] === 'true';
    var showHP = parameters['Show HP gauges'] === 'true';
    var showMP = parameters['Show MP gauges'] === 'true';

	var alias_Scene_Menu_create = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function() {
		alias_Scene_Menu_create.call(this);

	    this._commandWindow.x = 30;
	    this._commandWindow.y = 30;

	    this._statusWindow.x = Graphics.boxWidth-this._statusWindow.width;
	    this._statusWindow.y = Graphics.boxHeight-this._statusWindow.height;

	    this._goldWindow.x = Graphics.boxWidth-this._goldWindow.width;
	    this._goldWindow.y = Graphics.boxHeight-this._statusWindow.height-this._goldWindow.height;
	};

	// Window_MenuStatus
	Window_MenuStatus.prototype.windowWidth = function() {
	    return statusWindowActorWidth*statusWindowActorsNumber;
	};

	Window_MenuStatus.prototype.windowHeight = function() {
	    return Graphics.boxHeight/4;
	};

	Window_MenuStatus.prototype.numVisibleRows = function() {
	    return 1;
	};

	Window_MenuStatus.prototype.maxCols = function() {
	    return statusWindowActorsNumber;
	};

	Window_MenuStatus.prototype.lineHeight = function() {
	    return 29;
	};

	Window_MenuStatus.prototype.drawItemImage = function(index) {
	    var actor = $gameParty.members()[index];
	    var rect = this.itemRect(index);
	    this.changePaintOpacity(actor.isBattleMember());
	    if (showPortraits)
	    {
	 	    this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
	    }
	    this.changePaintOpacity(true);
	};

	Window_MenuStatus.prototype.drawItemStatus = function(index) {
	    var actor = $gameParty.members()[index];
	    var rect = this.itemRect(index);
	    var x = rect.x;
	    var y = rect.y;
	    var width = rect.width;
	    var lineHeight = this.lineHeight();
	    this.drawActorName(actor, x, y);
	    this.drawActorHp(actor, x, y + lineHeight * 1, width);
	    this.drawActorMp(actor, x, y + lineHeight * 2, width);
	    this.drawActorClass(actor, x, y + lineHeight * 3);
	    this.drawActorLevel(actor, x, y + lineHeight * 3);
	};

	Window_MenuStatus.prototype.drawActorHp = function(actor, x, y, width) {
	    width = width || 186;
	    if (showHP)
	    {
		    var color1 = this.hpGaugeColor1();
		    var color2 = this.hpGaugeColor2();
		    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
	    }
	    this.changeTextColor(this.systemColor());
	    this.drawText(TextManager.hpA, x, y, 44);
	    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
	                           this.hpColor(actor), this.normalColor());
	};

	Window_MenuStatus.prototype.drawActorMp = function(actor, x, y, width) {
	    width = width || 186;
	    if (showMP)
	    {
		    var color1 = this.mpGaugeColor1();
		    var color2 = this.mpGaugeColor2();
		    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
	    }
	    this.changeTextColor(this.systemColor());
	    this.drawText(TextManager.mpA, x, y, 44);
	    this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
	                           this.mpColor(actor), this.normalColor());
	};

	Window_MenuStatus.prototype.drawActorLevel = function(actor, x, y) {
	    this.resetTextColor();
	    this.drawText(actor.level, x + 84, y, 36, 'right');
	};

	// Window_MenuCommand
	Window_MenuCommand.prototype.maxRows = function() {
	    return this.maxItems()/2;
	};

	Window_MenuCommand.prototype.maxCols = function() {
	    return 2;
	};

	Window_MenuCommand.prototype.numVisibleRows = function() {
	    return this.maxRows();
	};

	Window_MenuCommand.prototype.numVisibleCols = function() {
	    return this.maxCols();
	};
})();