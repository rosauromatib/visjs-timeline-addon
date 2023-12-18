package com.vaadin.componentfactory.timeline.util;

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

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class TimelineUtil {

    public static LocalDateTime convertLocalDateTime(String stringDate) {
        return LocalDateTime.parse(stringDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    public static LocalDateTime convertDateTime(String milliSeconds) {
        if (milliSeconds == null)
            return null;
        long timestamp = Double.valueOf(milliSeconds).longValue();
        Instant date = Instant.ofEpochMilli(timestamp);
        return LocalDateTime.ofInstant(date, ZoneId.systemDefault());
    }

    public static LocalDateTime convertDateTimeFromString(String strDateTime) {
        if (strDateTime == null)
            return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        LocalDateTime dateTime = LocalDateTime.parse(strDateTime, formatter);
        return dateTime;
    }

    public static String formatDates(LocalDateTime date) {
        return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
    }
}
