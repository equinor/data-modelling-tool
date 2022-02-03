import React, {useContext, useState} from "react";
import {getUsername} from "../../utils/auth";
import {AuthContext} from '@dmt/common'
import {Button, Progress, TextField} from "@equinor/eds-core-react";
import {TAnalysis} from "./Types";
import {createAnalysis} from "./CRUD";
import {Blueprints} from "../../Enums";
import styled from "styled-components";
import {DEFAULT_DATASOURCE_ID} from "../../const";

type Errors = {
    name: string
}

type CreateFormProps = {
    onSubmit: Function
}

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(1, fit-content(100%));
`

const CreateForm = (props: CreateFormProps) => {
    const {onSubmit} = props;
    const [error, setError] = useState<Errors>({
        "name": ""
    })
    const [analysis, setAnalysis] = useState<TAnalysis>({})

    const formHandler = (event: any) => {
        event.preventDefault();
        const singleWordFormat = new RegExp('^[A-Za-z0-9-_]+$')
        if (!singleWordFormat.test(analysis.name)) {
            setError(
                {
                    "name": "Invalid operation name! (you cannot have empty name or use any special characters)."
                }
            )
        } else {
            setError({
                "name": ""
            })
            onSubmit(analysis)
        }
    }

    const handleInputChange = (event: any) => {

        setAnalysis({
            ...analysis,
            [event.target.id]: event.target.value
        })
    }

    const hasErrors = error["name"] !== ""

    return (
        <form onSubmit={formHandler}>
            <Wrapper>
                <TextField
                    id="name"
                    label="Name"
                    placeholder="Analysis name"
                    onChange={handleInputChange}
                    helperText={error.name ? error.name : "Provide the name of the analysis to be created"}
                    variant={hasErrors ? 'error' : 'default'}
                />
                <TextField
                    id="description"
                    label="Description"
                    placeholder="Description"
                    onChange={handleInputChange}
                    helperText={error.name ? error.name : "Short description about the analysis"}
                    variant={hasErrors ? 'error' : 'default'}
                />
                <Button type="submit" style={{marginTop: '14px'}} onSubmit={formHandler}>
                    Create
                </Button>
            </Wrapper>
        </form>
    )
}

const AnalysisNew = (): JSX.Element => {
    const {tokenData, token} = useContext(AuthContext)
    const user = getUsername(tokenData) || 'NoLogin'
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleCreateAnalysis = (formData: TAnalysis) => {
        setIsLoading(true)
        const data = {
            ...formData,
            type: Blueprints.ANALYSIS,
            creator: user
        }
        createAnalysis(data, token, []).then((documentId: any) => {
            document.location = `${DEFAULT_DATASOURCE_ID}/${documentId}/`
        })
    }


    if (isLoading) return <Progress.Linear/>

    return <CreateForm onSubmit={handleCreateAnalysis}/>
}

export default AnalysisNew