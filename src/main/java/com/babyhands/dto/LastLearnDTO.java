package com.babyhands.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LastLearnDTO {
	private int slTestGroup;
    private int correct;
    private Date slTestDate;
}
