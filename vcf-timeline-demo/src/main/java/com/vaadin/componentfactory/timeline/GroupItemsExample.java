package com.vaadin.componentfactory.timeline;

import com.vaadin.componentfactory.timeline.model.GroupItem;
import com.vaadin.componentfactory.timeline.model.Item;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.datetimepicker.DateTimePicker;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.renderer.LitRenderer;
import com.vaadin.flow.data.renderer.Renderer;
import com.vaadin.flow.router.Route;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Route(value = "group-items", layout = MainLayout.class)
public class GroupItemsExample extends Div {

        private Button addItemButton;
        private Item newItem;

        public GroupItemsExample() {
                // for logging changes
                VerticalLayout log = new VerticalLayout();

                // create items
                Item item1 = new Item(
                                LocalDateTime.of(2023, 8, 11, 2, 30, 00),
                                LocalDateTime.of(2023, 8, 11, 7, 00, 00),
                                "Item 1", 1);
                item1.setId("1");
                item1.setEditable(true);
                item1.setUpdateTime(true);

                Item item2 = new Item(
                                LocalDateTime.of(2023, 8, 13, 0, 00, 00),
                                LocalDateTime.of(2023, 8, 13, 12, 00, 00),
                                "Item 2", 6);
                item2.setId("2");
                item2.setEditable(true);
                item2.setUpdateTime(true);

                Item item3 = new Item(
                                LocalDateTime.of(2023, 8, 14, 2, 30, 00),
                                LocalDateTime.of(2023, 8, 15, 1, 00, 00),
                                "Item 3", 100);
                item3.setId("3");
                item3.setEditable(true);
                item3.setUpdateTime(true);

                Item item4 = new Item(
                                LocalDateTime.of(2023, 8, 16, 1, 30, 00),
                                LocalDateTime.of(2023, 8, 17, 1, 00, 00),
                                "Item 4", 106);
                item4.setId("4");
                item4.setEditable(true);
                item4.setUpdateTime(true);

                List<Item> items = Arrays.asList(item1, item2, item3, item4);

                GroupItem groupItem1243 = new GroupItem(1243, "Level 3 1243", true, 3);
                GroupItem groupItem1525 = new GroupItem(1525, "Level 3 1525", true, 3);
                GroupItem groupItem1624 = new GroupItem(1624, "Level 3 1624", true, 3);
                GroupItem groupItem2076 = new GroupItem(2076, "Level 3 2076", true, 3);
                GroupItem groupItem1345 = new GroupItem(1345, "Level 3 1345", true, 3);
                GroupItem groupItem2078 = new GroupItem(2078, "Level 3 2078", true, 3);
                GroupItem groupItem1826 = new GroupItem(1826, "Level 3 1826", true, 3);
                GroupItem groupItem2107 = new GroupItem(2107, "Level 3 2107", true, 3);
                GroupItem groupItem10 = new GroupItem(10, "Group 10", "1,2,3,4,5,6", true, 1);
                GroupItem groupItem1 = new GroupItem(1, "North America", "1243,1525,1624,1345,2078,1826,2076,2107",
                                true, 2);
                GroupItem groupItem2 = new GroupItem(2, "Latin America", true, 2);
                GroupItem groupItem3 = new GroupItem(3, "Europe", true, 2);
                GroupItem groupItem4 = new GroupItem(4, "Asia", true, 2);
                GroupItem groupItem5 = new GroupItem(5, "Oceania", true, 2);
                GroupItem groupItem6 = new GroupItem(6, "Africa", true, 2);
                GroupItem groupItem100 = new GroupItem(100, "Group 100", "101, 102, 103, 104, 105, 106", true, 1);
                GroupItem groupItem101 = new GroupItem(101, "North America", true, 2);
                GroupItem groupItem102 = new GroupItem(102, "Latin America", true, 2);
                GroupItem groupItem103 = new GroupItem(103, "Europe", true, 2);
                GroupItem groupItem104 = new GroupItem(104, "Asia", true, 2);
                GroupItem groupItem105 = new GroupItem(105, "Oceania", true, 2);
                GroupItem groupItem106 = new GroupItem(106, "Africa", true, 2);

                List<GroupItem> groupItems = Arrays.asList(groupItem10, groupItem1,groupItem1243, groupItem1525, groupItem1624, groupItem2076,
                        groupItem1345, groupItem2078, groupItem1826, groupItem2107,
                        groupItem2, groupItem3, groupItem4, groupItem5, groupItem6, groupItem100, groupItem101,
                                groupItem102, groupItem103, groupItem104, groupItem105, groupItem106);

                // empty timeline creation
                Timeline timeline = new Timeline(items, groupItems);

                // setting timeline range
                timeline.setTimelineRange(
                                LocalDateTime.of(2023, 1, 1, 00, 00, 00), LocalDateTime.of(2023, 9, 25, 00, 00, 00));

                // set multiselet so multiple items can be drag at once
                timeline.setMultiselect(true);

                // Select Item
                VerticalLayout selectLayout = new VerticalLayout();
                TextField textField = new TextField();
                Button setSelectBtn = new Button("Select Item", e -> {
                        timeline.setSelectItem(textField.getValue());
                });
                selectLayout.add(textField, setSelectBtn);

                // add listener to get new range values for drag item(s)
                boolean bAutoZoom = false;
                timeline.addItemSelectListener(
                        e -> {
                                timeline.onSelectItem(e.getTimeline(), e.getItemId(), bAutoZoom);
                                textField.setValue(e.getItemId());
                        }
                );

                VerticalLayout selectRangeLayout = new VerticalLayout();
                selectRangeLayout.setSpacing(false);
                Paragraph p = new Paragraph("Select range for new item: ");
                p.getElement().getStyle().set("margin-bottom", "5px");
                selectRangeLayout.add(p);

                ComboBox<GroupItem> comboBox = new ComboBox<>("Group Name");
                comboBox.setItems(groupItems);
                comboBox.setItemLabelGenerator(GroupItem::getContent);
                comboBox.setRenderer(createRenderer());
                comboBox.setValue(groupItem10);
                comboBox.setAllowCustomValue(true);

                DateTimePicker datePicker1 = new DateTimePicker("Item start date: ");
                datePicker1.setMin(LocalDateTime.of(2023, 1, 10, 00, 00, 00));
                datePicker1.setMax(LocalDateTime.of(2023, 8, 22, 00, 00, 00));

                DateTimePicker datePicker2 = new DateTimePicker("Item end date: ");
                datePicker2.setMin(LocalDateTime.of(2023, 1, 10, 00, 00, 00));
                datePicker2.setMax(LocalDateTime.of(2023, 8, 22, 00, 00, 00));

                datePicker1.addValueChangeListener(
                        e -> {
                                GroupItem selectedGroupItem = comboBox.getValue();
                                newItem = createNewItem(datePicker1.getValue(), datePicker2.getValue(), selectedGroupItem.getId());
                        });
                datePicker2.addValueChangeListener(
                        e -> {
                                GroupItem selectedGroupItem = comboBox.getValue();
                                newItem = createNewItem(datePicker1.getValue(), datePicker2.getValue(), selectedGroupItem.getId());
                        });

                comboBox.addValueChangeListener(
                        e -> {
                                GroupItem selectedGroupItem = comboBox.getValue();
                                newItem = createNewItem(datePicker1.getValue(), datePicker2.getValue(), selectedGroupItem.getId());
                        });

                HorizontalLayout horizontalLayout = new HorizontalLayout();
                horizontalLayout.add(datePicker1, datePicker2, comboBox);

                addItemButton =
                        new Button(
                                "Add Item",
                                e -> {
                                        timeline.addItem(newItem, bAutoZoom);
                                        newItem = null;
                                        datePicker1.clear();
                                        datePicker2.clear();
                                });
                addItemButton.setDisableOnClick(true);
                addItemButton.setEnabled(false);

                selectRangeLayout.add(horizontalLayout, addItemButton);

                HorizontalLayout zoomOptionsLayout = new HorizontalLayout();
                zoomOptionsLayout.setMargin(true);
                Button oneDay = new Button("1 day", e -> timeline.setZoomOption(1));
                Button threeDays = new Button("3 days", e -> timeline.setZoomOption(3));
                Button fiveDays = new Button("5 days", e -> timeline.setZoomOption(5));



                zoomOptionsLayout.add(oneDay, threeDays, fiveDays, selectLayout);
                add(selectRangeLayout, zoomOptionsLayout, timeline, log);

        }

        private boolean cancelMove(List<Item> items) {
                return items.stream().anyMatch(i -> i.getId().equals("1") || i.getId().equals("3"));
        }

        private String formatDates(LocalDateTime date) {
                return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
        }

        private Item createNewItem(LocalDateTime start, LocalDateTime end, String groupID) {
                if (start != null && end != null) {
                        if (start.isBefore(end)) {
                                addItemButton.setEnabled(true);
                                return new Item(start, end, Integer.parseInt(groupID));
                        } else {
                                Notification.show("End date should be after start date", 5000, Notification.Position.MIDDLE);
                                return null;
                        }
                } else {
                        addItemButton.setEnabled(false);
                        return null;
                }
        }

        private Renderer<GroupItem> createRenderer() {
                StringBuilder tpl = new StringBuilder();
                tpl.append("<span style= \"font-weight: ${item.width}; font-size: ${item.fontsize}\">${item.content}</span>");

                return LitRenderer.<GroupItem>of(tpl.toString())
                        .withProperty("width", groupItem -> {
                                if(groupItem.getTreeLevel() == 1)
                                        return "bolder";
                                else if(groupItem.getTreeLevel() == 2)
                                        return "bold";
                                else
                                        return "normal";
                        })
                        .withProperty("fontsize", groupItem -> {
                                if(groupItem.getTreeLevel() == 1)
                                        return "1rem";
                                else if(groupItem.getTreeLevel() == 2)
                                        return "0.9rem";
                                else
                                        return "0.8rem";
                        })
                        .withProperty("content", GroupItem::getContent);
        }
}
