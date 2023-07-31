/*-
 * #%L
 * Timeline
 * %%
 * Copyright (C) 2021 Vaadin Ltd
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
import Arrow from "./arrow.js";
import moment from "moment";

import {
    DataSet, Timeline,
} from "vis-timeline/standalone/umd/vis-timeline-graph2d.min.js";

window.vcftimeline = {
    create: function (container, itemsJson, optionsJson) {
        setTimeout(() => this._createTimeline(container, itemsJson, null, optionsJson));
    },

    createGroups: function (container, itemsJson, groupJson, optionsJson) {
        setTimeout(() => this._createTimeline(container, itemsJson, groupJson, optionsJson));
    },

    _createTimeline: function (container, itemsJson, groupsJson, optionsJson) {
        // parsed items
        var parsedItems = JSON.parse(itemsJson);
        var items;
        var groupItems = new DataSet();
        var bGroup = false;
        if (groupsJson != null) bGroup = true;
        if (bGroup) {
            var parsedGroupItems = JSON.parse(groupsJson);
            for (var i = 0; i < parsedGroupItems.length; i++) {
                var nestedGroups = [];
                var groupsNested = [];
                try {
                    nestedGroups = parsedGroupItems[i].nestedGroups.split(",");

                    for (var j = 0; j < nestedGroups.length; j++) {
                        groupsNested[j] = Number.parseInt(nestedGroups[j]);
                    }
                } catch (e) {
                    groupsNested = null;
                }

                groupItems.add({
                    id: Number.parseInt(parsedGroupItems[i].groupId),
                    content: parsedGroupItems[i].content,
                    treeLevel: parsedGroupItems[i].treeLevel,
                    nestedGroups: groupsNested,
                    visible: parsedGroupItems[i].visible,
                    className: "vis-group-unselected",
                });
            }
            items = new DataSet();
            var types = ["box", "point", "range", "background"];
            for (var i = 0; i < parsedItems.length; i++) {
                var start = parsedItems[i].start;
                var end = parsedItems[i].end;
                var type = 0;

                items.add({
                    id: i, group: parsedItems[i].group, content: "item " + i, start: start, end: end, type: type,
                });
            }

        } else items = new DataSet(parsedItems);

        // // Get options for timeline configuration
        var options = this._processOptions(container, optionsJson);
        // Create Timeline
        var timeline;
        if (bGroup) {
            let startDay = moment().startOf("month").startOf("week").isoWeekday(1);
            var options1 = {
                start: startDay.toDate(),
                end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
                horizontalScroll: true,
                zoomKey: "ctrlKey",
                orientation: "both",
                zoomMin: 1000 * 60 * 60 * 240,
            };
            timeline = new Timeline(container, items, groupItems, options);
        } else timeline = new Timeline(container, items, options);

        const line_timeline = new Arrow(timeline, bGroup);
        container.timeline = line_timeline;

        var group = null;
        var bodyClicked = false;

        container.timeline._timeline.on("select", (properties) => {
            var temp = properties.items.toString();
            container.$server.onSelect(temp.replace(" ", ""));
        });

        // container.timeline._timeline.on("groupOnClick", (properties) => {
        //     // container.$server.onSelectItemInGroup(properties.groupId);
        // });

        container.timeline._timeline.itemSet.groupHammer.on("tap", (properties) => {
            var itemSet = container.timeline._timeline.itemSet;
            var temp = itemSet.groupFromTarget(properties);
            group = itemSet.groupsData.get(temp.groupId);

            container.$server.onSelectItemInGroup(group.id);
            if (!group.nestedGroups) this._updateGroupClassName(container, group, "vis-group-selected");

        });

        container.timeline._timeline.on("tap", (properties) => {
            console.log("ABC: ", container.timeline._timeline);
            var targetEle = properties.firstTarget.classList.value;
            if (bGroup) {
                if (!(targetEle.includes("vis-label") || targetEle.includes("vis-inner"))) {
                    var itemSet = container.timeline._timeline.itemSet;
                    var tempGroup = itemSet.groupFromTarget(properties);
                    if (tempGroup) {
                        var group = itemSet.groupsData.get(tempGroup.groupId);

                        // container.$server.onSelectItemInGroup(group.id);
                        bodyClicked = true;

                        this._updateGroupClassName(container, group, "vis-group-selected");
                    }
                }
            }
        });

        container.timeline._timeline.on("_change", (properties) => {
            if (properties) {
                this._updateGroupClassName(container, group, "vis-group-selected");
                // bodyClicked = true;
            }
        });

        container.timeline._timeline.on("changed", () => {
            this._updateConnections(container, false);
            this._updateTimelineHeight(container);
        });

        // var bItemClicked = false;
        // var startPointTime = 0;
        // var endPointTime;
        // var startPointY = -1000000;
        // var endPointY;
        // container.timeline._timeline.on("mouseDown", (e) => {
        //     startPointTime = e.time.getTime();
        //     startPointY = e.y;
        //     if (e.item != null)
        //         bItemClicked = true;
        //     else
        //         bItemClicked = false;
        //
        // });
        // container.timeline._timeline.on("mouseMove", (e) => {
        //     endPointTime = e.time.getTime();
        //     endPointY = e.y;
        //     if (!bItemClicked) {
        //         e.event.stopPropagation();
        //         this._updateMultiSelectionByDragAndDrop(container, startPointTime, endPointTime, startPointY, endPointY);
        //     }
        // });
        // container.timeline._timeline.on("mouseUp", (e) => {
        //     endPointTime = e.time.getTime();
        //     startPointTime = 0;
        //     startPointY = -1000000;
        // });


        setInterval(function () {
            var isDragging = container.timeline._timeline.itemSet.touchParams.itemIsDragging;
            var isResizingRight = container.timeline._timeline.itemSet.touchParams.dragRightItem;
            var isResizingLeft = container.timeline._timeline.itemSet.touchParams.dragLeftItem;
            var isResizing = isResizingRight !== isResizingLeft;
            if (isDragging) {
                let multiple = container.timeline._timeline.itemSet.touchParams.itemProps.length > 1;
                let itemsInitialXMap = null;
                let selectedItems = null;
                if (multiple) {
                    itemsInitialXMap = new Map();
                    container.timeline._timeline.itemSet.touchParams.itemProps.forEach((obj) => {
                        itemsInitialXMap.set(obj.data.id, obj.initialX);
                    });
                    selectedItems = Array.from(container.timeline._timeline.itemSet.touchParams.itemProps, (obj) => obj.item);
                }

                var ix = container.timeline._timeline.itemSet.touchParams.itemProps[0].initialX;
                var item = container.timeline._timeline.itemSet.touchParams.selectedItem;
                var range = container.timeline._timeline.getWindow();
                var widthInPixels = container.timeline._timeline.body.domProps.lastWidth;
                var centerOfTimelineInPixels = container.timeline._timeline.dom.container.offsetLeft + container.timeline._timeline.body.domProps.lastWidth / 2;
                var mouseAtLeftOfCenter = mouseX < centerOfTimelineInPixels;
                var widthInMilliseconds = range.end.valueOf() - range.start.valueOf();

                // handle autoscrolling when moving, not resizing
                if (mouseAtLeftOfCenter && item.data.start <= range.start && (options.min == undefined || range.start > new Date(options.min)) && !isResizing) {
                    window.vcftimeline._moveWindowToRight(container, range, widthInMilliseconds);
                    if (multiple) {
                        container.timeline._timeline.itemSet.touchParams.itemProps.forEach((ip) => {
                            let id = ip.data.id;
                            let initialXValue = itemsInitialXMap.get(id);
                            ip.initialX = initialXValue + widthInPixels / 50;
                        });
                        selectedItems.forEach((selectedItem) => {
                            selectedItem.data.start = new Date(selectedItem.data.start.valueOf() - widthInMilliseconds / 50);
                            selectedItem.data.end = new Date(selectedItem.data.end.valueOf() - widthInMilliseconds / 50);
                        });
                    } else {
                        container.timeline._timeline.itemSet.touchParams.itemProps[0].initialX = ix + widthInPixels / 50;
                        item.data.start = new Date(item.data.start.valueOf() - widthInMilliseconds / 50);
                        item.data.end = new Date(item.data.end.valueOf() - widthInMilliseconds / 50);
                    }
                } else if (!mouseAtLeftOfCenter && item.data.end >= range.end && (options.max == undefined || range.end < new Date(options.max)) && !isResizing) {
                    window.vcftimeline._moveWindowToLeft(container, range, widthInMilliseconds);
                    if (multiple) {
                        container.timeline._timeline.itemSet.touchParams.itemProps.forEach((ip) => {
                            let id = ip.data.id;
                            let initialXValue = itemsInitialXMap.get(id);
                            ip.initialX = initialXValue - widthInPixels / 50;
                        });
                        selectedItems.forEach((selectedItem) => {
                            selectedItem.data.start = new Date(selectedItem.data.start.valueOf() + widthInMilliseconds / 50);
                            selectedItem.data.end = new Date(selectedItem.data.end.valueOf() + widthInMilliseconds / 50);
                        });
                    } else {
                        container.timeline._timeline.itemSet.touchParams.itemProps[0].initialX = ix - widthInPixels / 50;
                        item.data.start = new Date(item.data.start.valueOf() + widthInMilliseconds / 50);
                        item.data.end = new Date(item.data.end.valueOf() + widthInMilliseconds / 50);
                    }
                }

                // auto scroll to left when resizing left
                if (item.data.start <= range.start && (options.min == undefined || range.start > new Date(options.min)) && isResizingLeft) {
                    window.vcftimeline._moveWindowToRight(container, range, widthInMilliseconds, widthInPixels, ix);
                    item.data.start = new Date(item.data.start.valueOf() - widthInMilliseconds / 50);
                }

                // auto scroll to right when resizing left
                if (item.data.start >= range.end && (options.max == undefined || range.end < new Date(options.max)) && isResizingLeft) {
                    window.vcftimeline._moveWindowToLeft(container, range, widthInMilliseconds, widthInPixels, ix);
                    item.data.start = new Date(item.data.start.valueOf() + widthInMilliseconds / 50);
                }

                // auto scroll to right when resizing right
                if (item.data.end >= range.end && (options.max == undefined || range.end < new Date(options.max)) && isResizingRight) {
                    window.vcftimeline._moveWindowToLeft(container, range, widthInMilliseconds, widthInPixels, ix);
                    item.data.end = new Date(item.data.end.valueOf() + widthInMilliseconds / 50);
                }

                // auto scroll to left when resizing right
                if (item.data.end <= range.start && (options.min == undefined || range.start > new Date(options.min)) && isResizingRight) {
                    window.vcftimeline._moveWindowToRight(container, range, widthInMilliseconds, widthInPixels, ix);
                    item.data.end = new Date(item.data.end.valueOf() - widthInMilliseconds / 50);
                }
            }
        }, 100);
    },

    setFocusSelectionByDragAndDrop(container, bFocus) {
        var startPointTime = 0;
        var endPointTime;
        var startPointY = -1000000;
        var endPointY;

        if(bFocus)
            this._drawRectangleWhenDraging(container);

        container.timeline._timeline.on("mouseDown", (e) => {
            startPointTime = e.time.getTime();
            startPointY = e.y;
            if (bFocus) {
                container.timeline._timeline.touch.allowDragging = false;
            } else {
                container.timeline._timeline.touch.allowDragging = true;
                container.timeline._timeline.emit("mouseMove", container.timeline._timeline.getEventProperties(e.event));
            }

        });
        container.timeline._timeline.on("mouseMove", (e) => {
            if (startPointTime == 0 || container.timeline._timeline.touch.allowDragging)
                return;
            endPointTime = e.time.getTime();
            endPointY = e.y;
            if (bFocus) {
                e.event.stopPropagation();
                this._updateMultiSelectionByDragAndDrop(container, startPointTime, endPointTime, startPointY, endPointY);
            }
        });
        container.timeline._timeline.on("mouseUp", (e) => {
            endPointTime = e.time.getTime();
            startPointTime = 0;
            startPointY = -1000000;
        });
    },

    _updateMultiSelectionByDragAndDrop(container, startPointTime, endPointTime, startPointY, endPointY) {

        var itemset = container.timeline._timeline.itemSet;
        var itemIds = "";
        var itemArray = Object.values(itemset.items);
        for (var i = 0; i < itemArray.length; i++) {
            var startXTemp = startPointTime < endPointTime ? startPointTime : endPointTime;
            var endXTemp = startPointTime > endPointTime ? startPointTime : endPointTime;
            var startYTemp = startPointY < endPointY ? startPointY : endPointY;
            var endYTemp = startPointY > endPointY ? startPointY : endPointY;
            if (startPointTime != 0) if (startXTemp <= itemArray[i].data.start.getTime() && endXTemp >= itemArray[i].data.end.getTime()) {
                // console.log("I am here", itemArray[i]);
                var groupItemTemp = itemset.groups[itemArray[i].parent.groupId];
                var itemY = groupItemTemp.top + itemArray[i].top;
                if (startYTemp <= itemY && endYTemp >= itemY + itemArray[i].height) {
                    if (itemIds == "") itemIds = itemArray[i].id.toString(); else itemIds += "," + itemArray[i].id.toString();
                }

            }
        }
        if (startPointTime != 0) container.$server.onSelect(itemIds);
        // this.onSelectItem(container, itemIds, false);
    },

    setUseLineConnector: function (container, bUseLineConnector) {
        this._updateConnections(container, bUseLineConnector);
    },

    setHighlightRange: function (container, start, end) {
        container.timeline._timeline.on("changed", () => {
            container.timeline._timeline.timeAxis._repaintLabels();
            var left = (start - container.timeline._timeline.range.start) * container.timeline._timeline.body.domProps.centerContainer.width / (container.timeline._timeline.range.end - container.timeline._timeline.range.start);
            var width = (end - start) * container.timeline._timeline.body.domProps.centerContainer.width / (container.timeline._timeline.range.end - container.timeline._timeline.range.start);
            container.timeline._timeline.timeAxis._repaintMinorLine(left, width, "both", "vis-grid-highlighted");
        });
    },

    _moveWindowToRight(container, range, widthInMilliseconds) {
        container.timeline._timeline.setWindow(new Date(range.start.valueOf() - widthInMilliseconds / 50), new Date(range.end.valueOf() - widthInMilliseconds / 50), {animation: false});
    },

    _moveWindowToLeft(container, range, widthInMilliseconds) {
        container.timeline._timeline.setWindow(new Date(range.start.valueOf() + widthInMilliseconds / 50), new Date(range.end.valueOf() + widthInMilliseconds / 50), {animation: false});
    },

    _processOptions: function (container, optionsJson) {
        var parsedOptions = JSON.parse(optionsJson);

        var snapStep = parsedOptions.snapStep;
        delete parsedOptions.snapStep;

        var autoZoom = parsedOptions.autoZoom;
        delete parsedOptions.autoZoom;

        var tooltipOnItemUpdateTime = parsedOptions.tooltipOnItemUpdateTime;
        var tooltipDateFormat = parsedOptions.tooltipOnItemUpdateTimeDateFormat;
        var tooltipTemplate = parsedOptions.tooltipOnItemUpdateTimeTemplate;
        delete parsedOptions.tooltipOnItemUpdateTime;
        delete parsedOptions.tooltipOnItemUpdateTimeDateFormat;
        delete parsedOptions.tooltipOnItemUpdateTimeTemplate;

        var defaultOptions = {
            onMove: function (item, callback) {
                var oldItem = container.timeline._timeline.itemSet.itemsData.get(item.id);

                var isResizedItem = oldItem.end.getTime() - oldItem.start.getTime() != item.end.getTime() - item.start.getTime();
                var moveItem = true;

                if (isResizedItem && (item.start.getTime() >= item.end.getTime() || item.end.getTime() <= item.start.getTime())) {
                    moveItem = false;
                }

                if (moveItem) {

                    callback(item);
                    var startDate = window.vcftimeline._convertDate(item.start);
                    var endDate = window.vcftimeline._convertDate(item.end);
                    //update connections
                    window.vcftimeline._updateConnections(container, false);
                    //call server
                    container.$server.onMove(item.id, startDate, endDate, isResizedItem);
                } else {
                    // undo resize
                    callback(null);
                }
            },

            snap: function (date, scale, step) {
                var hour = snapStep * 60 * 1000;
                return Math.round(date / hour) * hour;
            },
        };

        var options = {};
        Object.assign(options, parsedOptions, defaultOptions);

        if (autoZoom && options.min && options.max) {
            options.start = options.min;
            options.end = options.max;
        }

        if (tooltipOnItemUpdateTime) {
            (options.editable = {updateTime: true}), (options.tooltipOnItemUpdateTime = {
                template: function (item) {
                    var startDate = moment(item.start).format("MM/DD/YYYY HH:mm");
                    var endDate = moment(item.end).format("MM/DD/YYYY HH:mm");

                    if (tooltipDateFormat) {
                        startDate = moment(item.start).format(tooltipDateFormat);
                        endDate = moment(item.end).format(tooltipDateFormat);
                    }
                    if (tooltipTemplate) {
                        var templateCopy = tooltipTemplate;
                        templateCopy = templateCopy.replace("item.start", startDate);
                        templateCopy = templateCopy.replace("item.end", endDate);
                        return templateCopy;
                    } else {
                        return "Start: " + startDate + "</br> End: " + endDate;
                    }
                },
            });
        }

        return options;
    },

    setOptions: function (container, optionsJson) {
        var options = this._processOptions(container, optionsJson);
        container.timeline._timeline.setOptions(options);
    },

    onSelectItem: function (container, onSelectItem, autoZoom) {
        var temp = onSelectItem.split(",");
        container.timeline._timeline.itemSet.setSelection(temp);
        if (autoZoom) {
            container.timeline._timeline.fit();
        }
    },

    addItem: function (container, newItemJson, autoZoom) {
        var parsedItems = JSON.parse(newItemJson);
        container.timeline._timeline.itemsData.add({
            id: Object.keys(container.timeline._timeline.itemSet.items).length,
            group: Number.parseInt(parsedItems.group),
            content: "item " + Object.keys(container.timeline._timeline.itemSet.items).length,
            start: parsedItems.start,
            end: parsedItems.end,
            type: 0,
        });
        if (autoZoom) {
            container.timeline._timeline.fit();
        }
    },

    setItems: function (container, itemsJson, autoZoom) {
        var items = new DataSet(JSON.parse(itemsJson));
        container.timeline._timeline.setItems(items);
        if (autoZoom) container.timeline._timeline.fit();
    },

    revertMove: function (container, itemId, itemJson) {
        var itemData = container.timeline._timeline.itemSet.items[itemId].data;
        var parsedItem = JSON.parse(itemJson);
        itemData.start = parsedItem.start;
        itemData.end = parsedItem.end;

        let calculatedLeft = container.timeline._timeline.itemSet.items[itemId].conversion.toScreen(moment(itemData.start));
        container.timeline._timeline.itemSet.items[itemId].left = calculatedLeft;

        container.timeline._timeline.itemsData.update(itemData);
    },

    removeItem: function (container, itemId) {
        container.timeline._timeline.itemsData.remove(itemId);
        container.$server.onRemove(itemId);
    },

    updateItemContent: function (container, itemId, newContent) {
        var itemData = container.timeline._timeline.itemSet.items[itemId].data;
        itemData.content = newContent;
        container.timeline._timeline.itemsData.update(itemData);
    },

    _updateGroupClassName: function (container, group, newClassName) {
        var data = {
            id: Number.parseInt(group.id),
            content: group.content,
            treeLevel: group.treeLevel,
            nestedGroups: group.nestedGroups,
            visible: group.visible,
            className: newClassName,
        };
        this._removeGroupsClassName(container, group.id, "vis-group-unselected");
        container.timeline._timeline.itemSet.groups[group.id].setData(data);
    },

    _removeGroupsClassName: function (container, groupId, oldClassName) {
        var itemSet = container.timeline._timeline.itemSet;
        var parsedGroups = Object.keys(itemSet.groups);
        for (var anyGroupId = 0; anyGroupId < parsedGroups.length; anyGroupId++) {
            if (Number.parseInt(parsedGroups[anyGroupId]) != Number.parseInt(groupId)) {
                var tempGroup = itemSet.groupsData.get(Number.parseInt(parsedGroups[anyGroupId]));
                if (tempGroup != null) {
                    var data = {
                        id: Number.parseInt(tempGroup.id),
                        content: tempGroup.content,
                        treeLevel: tempGroup.treeLevel,
                        nestedGroups: tempGroup.nestedGroups,
                        visible: tempGroup.visible,
                        className: oldClassName,
                    };
                    container.timeline._timeline.itemSet.groups[tempGroup.id].setData(data);
                }
            }
        }
    },

    setZoomOption: function (container, zoomDays) {
        var startDate;
        var selectedItems = container.timeline._timeline.getSelection();
        if (selectedItems.length > 0) {
            var selectedItem = selectedItems.length > 1 ? this._sortItems(selectedItems)[0] : selectedItems[0];
            startDate = container.timeline._timeline.itemSet.items[selectedItem].data.start;
        } else {
            var range = container.timeline._timeline.getWindow();
            startDate = range.start;
        }

        var start = moment(startDate);
        start.hour(0);
        start.minutes(0);
        start.seconds(0);

        var end = moment(startDate);
        end.add(zoomDays, "days");

        container.timeline._timeline.setWindow({
            start: start, end: end,
        });
    },

    _convertDate: function (date) {
        var local = new Date(date);
        local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return local.toJSON().slice(0, 19);
    },

    _sortItems: function (items) {
        var sortedItems = items.sort(function (item1, item2) {
            var item1_date = new Date(item1.start), item2_date = new Date(item2.start);
            return item1_date - item2_date;
        });
        return sortedItems;
    },

    _createConnections: function (items) {
        // Sort items in order to be able to create connections for timeline-arrow
        // (horizontal line)
        var sortedItems = this._sortItems(items);

        // Create connections for items
        var connections = [];
        for (let i = 0; i < sortedItems.length - 1; i++) {
            var element = sortedItems[i];
            var nextElement = sortedItems[i + 1];

            var id = i + 1;
            var id_item_1 = element.id;
            var id_item_2 = nextElement.id;

            var item = {};
            item["id"] = id;
            item["id_item_1"] = id_item_1;
            item["id_item_2"] = id_item_2;

            connections.push(item);
        }
        return connections;
    },

    _updateConnections: function (container, bUseLineConnector) {
        if (bUseLineConnector) {
            var connections = this._createConnections(container.timeline._timeline.itemsData.get());
            container.timeline.setDependencies(connections);
        } else {
            container.timeline.setDependencies([]);
        }
    },

    _updateTimelineHeight: function (container) {
        if (container.timelineHeight == undefined) {
            container.timelineHeight = container.timeline._timeline.dom.container.getBoundingClientRect().height;
        }
        if (container.timeline._timeline.options.height == undefined) {
            container.timeline._timeline.options.height = container.timelineHeight;
        }
    },
    _drawRectangleWhenDraging: function (container) {
        var selectionElement = document.getElementById("selection");
        var startX, startY, endX, endY;

        container.timeline._timeline.on("mouseDown", (e) => {

            startX = e.event.x;
            startY = e.event.y;

            console.log("mousedown: ", startX, startY);

            selectionElement.style.left = startX + "px";
            selectionElement.style.top = startY + "px";
            selectionElement.style.width = "0";
            selectionElement.style.height = "0";
            selectionElement.style.display = "block";
        });

        container.timeline._timeline.on("mouseMove", (e) => {

            if (startX !== undefined && startY !== undefined) {
                endX = e.event.clientX;
                endY = e.event.clientY;

                var width = Math.abs(endX - startX);
                var height = Math.abs(endY - startY);

                console.log("mousemove: ", width, height);

                selectionElement.style.width = width + "px";
                selectionElement.style.height = height + "px";

                selectionElement.style.left = (endX < startX) ? (startX - width) + "px" : startX + "px";
                selectionElement.style.top = (endY < startY) ? (startY - height) + "px" : startY + "px";
            }
        });

        container.timeline._timeline.on("mouseUp", (e) => {
            startX = undefined;
            startY = undefined;
            selectionElement.style.display = "none";
        });
    },
};