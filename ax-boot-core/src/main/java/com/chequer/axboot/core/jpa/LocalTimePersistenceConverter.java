/**
 * Copyright (c) 2014, JPAAttributeConverters
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *     * Neither the name of JPAAttributeConverters, any associated website, nor the
 * names of its contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL JPAATTRIBUTECONVERTERS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package com.chequer.axboot.core.jpa;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.sql.Time;
import java.time.LocalTime;

/**
 * Converts {@link LocalTime} to {@link java.sql.Time} and back
 * in support of JPA persistence.
 * <p>
 * The existence of this class in the classpath and it being known by the persistence unit
 * is sufficient
 * to allow you to use the as-of Java SE 8 {@link LocalTime} class in
 * an {@link javax.persistence.Entity} or in other persistable classes.
 * <p>
 * Important: the setting of <code>@Converter(autoApply = true)</code>
 * in this class will make this conversion
 * effective for all Entities that have one or more
 * persistent {@link java.time.LocalTime} properties.
 * <p>
 * The persistence provider must minimally support
 * <a href="https://jcp.org/aboutJava/communityprocess/final/jsr338/index.html">JPA 2.1</a>
 * for this to work.
 */
@Converter(autoApply = true)
public class LocalTimePersistenceConverter implements AttributeConverter<LocalTime, Time> {

    @Override
    public Time convertToDatabaseColumn(LocalTime entityValue) {
        return (entityValue == null) ? null : Time.valueOf(entityValue);
    }


    @Override
    public LocalTime convertToEntityAttribute(Time databaseValue) {
        if (databaseValue == null)
            return null;

        return databaseValue.toLocalTime();
    }

}

