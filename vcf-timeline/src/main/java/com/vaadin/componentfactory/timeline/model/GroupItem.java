package com.vaadin.componentfactory.timeline.model;

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

import com.vaadin.componentfactory.timeline.event.GroupItemSelectEvent;
import com.vaadin.flow.component.ClickEvent;
import com.vaadin.flow.component.ClickNotifier;
import com.vaadin.flow.component.ComponentEventListener;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.shared.Registration;
import elemental.json.Json;
import elemental.json.JsonObject;

import java.util.Objects;
import java.util.Optional;

/**
 * Representation of a timeline item.
 */
@Tag("GroupItem")
public class GroupItem {

  private String groupId;

  private String content;

  private int treeLevel = 1;

  private String nestedGroups;

  private boolean visible;
  private String className;

  public GroupItem() {
  }

  public GroupItem(int groupId, String content, String nestedGroups, boolean visible, int treeLevel) {
    this.setId(String.valueOf(groupId));
    this.setContent(content);
    this.setNestedGroups(nestedGroups);
    this.setVisible(visible);
    this.setTreeLevel(treeLevel);
  }

  public GroupItem(int groupId, String content, boolean visible, int treeLevel) {
    this.setId(String.valueOf(groupId));
    this.setContent(content);
    this.setNestedGroups(null);
    this.setVisible(visible);
    this.setTreeLevel(treeLevel);
  }

  public String getGroupId() {
    return groupId;
  }

  public void setId(String groupId) {
    this.groupId = groupId;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public String getNestedGroups() {
    return nestedGroups;
  }

  public void setNestedGroups(String nestedGroups) {
    this.nestedGroups = nestedGroups;
  }

  public boolean isVisible() {
    return visible;
  }

  public void setVisible(boolean visible) {
    this.visible = visible;
  }

  public String getClassName() {
    return className;
  }

  public void setClassName(String className) {
    this.className = className;
  }

  @Override
  public int hashCode() {
    return Objects.hash(groupId);
  }

  public int getTreeLevel() {
    return treeLevel;
  }

  public void setTreeLevel(int treeLevel) {
    this.treeLevel = treeLevel;
  }


  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null) return false;
    if (getClass() != obj.getClass()) return false;
    GroupItem other = (GroupItem) obj;
    return Objects.equals(groupId, other.groupId);
  }

  public String toJSON() {
    JsonObject js = Json.createObject();
    Optional.ofNullable(getGroupId()).ifPresent(v -> js.put("groupId", v));
    Optional.ofNullable(getContent()).ifPresent(v -> js.put("content", v));
    Optional.ofNullable(getTreeLevel()).ifPresent(v -> js.put("treeLevel", v));
    Optional.ofNullable(getNestedGroups()).ifPresent(v -> js.put("nestedGroups", v));
    Optional.ofNullable(isVisible()).ifPresent(v -> js.put("visible", v));
    Optional.ofNullable(getClassName()).ifPresent(v -> js.put("className", v));

    return js.toJson();
  }
}
