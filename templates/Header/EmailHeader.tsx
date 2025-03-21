import React from 'react';
import {MjmlColumn, MjmlImage, MjmlSection, MjmlText} from "@faire/mjml-react";

function EmailHeader({headerText}: { headerText: string }) {
    return (
        <MjmlSection background-color="#500E0E" padding="20px">
            <MjmlColumn>
                <MjmlImage href="https://zjxartcc.org" src="https://zjxartcc.org/img/logo.png" alt="Virtual Jacksonville ARTCC"
                           width="200px"/>
                <MjmlText align="center" color="#EDEDF5" fontWeight="bold">
                    {headerText}
                </MjmlText>
            </MjmlColumn>
        </MjmlSection>
    );
}

export default EmailHeader;