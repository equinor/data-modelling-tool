import {Button, Card, Label, Typography} from "@equinor/eds-core-react";
import {hasExpertRole} from "../../../utils/auth";
import Icons from "../../../components/Design/Icons";
import React, {useContext, useState} from "react";
import {TAnalysis} from "../Types";
import {CustomScrim} from "../../../components/CustomScrim";
import {AccessControlList, AuthContext} from "@dmt/common";
import {DEFAULT_DATASOURCE_ID} from "../../../const";
import styled from "styled-components";
import {edit_text} from "@equinor/eds-icons";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`
const CardWrapper = styled.div`
  height: auto;
  width: 400px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, 320px);
  grid-gap: 32px 32px;
  border-radius: 5px;
`

type AnalysisInfoCardProps = {
    analysis: TAnalysis
}

const AnalysisInfoCard = (props: AnalysisInfoCardProps) => {
    const {analysis} = props
    const [viewACL, setViewACL] = useState<boolean>(false)
    const {tokenData} = useContext(AuthContext)

    return (
        <CardWrapper>
            <Card style={{maxWidth: '1200px'}}>
                <Card.Header>
                    <Card.HeaderTitle>
                        <Typography variant="h5">
                            {analysis.label || analysis.name}
                        </Typography>
                    </Card.HeaderTitle>
                </Card.Header>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <FlexWrapper>
                            <Label label="Creator:"/>
                            {analysis.creator}
                        </FlexWrapper>
                        <FlexWrapper>
                            <Label label="Created:"/>
                            {new Date(analysis.created).toLocaleString(navigator.language)}
                        </FlexWrapper>
                        <FlexWrapper>
                            <Label label="Updated:"/>
                            {new Date(analysis.updated).toLocaleString(navigator.language)}
                        </FlexWrapper>
                        <FlexWrapper>
                            <Label label="Description:"/>
                            {analysis.description}
                        </FlexWrapper>
                    </div>
                </div>
                <Card.Actions>
                    <Button>
                        Edit
                        <Icons name="edit_text" title="edit_text"/>
                    </Button>
                    {hasExpertRole(tokenData) && (
                        <Button
                            onClick={() => {
                                setViewACL(!viewACL)
                            }}
                        >
                            Access control
                            <Icons name="assignment_user" title="assignment_user"/>
                        </Button>
                    )}
                </Card.Actions>
            </Card>
            {viewACL && (
                <CustomScrim
                    header={'Access control'}
                    closeScrim={() => setViewACL(false)}
                >
                    <AccessControlList
                        documentId={analysis._id}
                        dataSourceId={DEFAULT_DATASOURCE_ID}
                    />
                </CustomScrim>
            )}
        </CardWrapper>
    )
}

export default AnalysisInfoCard