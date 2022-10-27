import { useState } from 'react'
import styled from 'styled-components'
import InputsHook, { ValuesI } from '../hook/inputs'
import axios from 'axios'
import { GlobalI, useGlobalContext } from '../context/global'
import { useNavigate } from 'react-router-dom'
import { colors } from '../styles/colors'

const LoginS = styled.section`
    justify-content: center;
    align-items: center;
    height: 100%;
`

const LogoS = styled.div`
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
`

const LogoTxtS = styled.h1`
    color: ${ colors.orange };
    font-size: 40px;
    text-align: center;
`

const LoginContainer = styled.main`
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    text-align: center;
    width: 90%;
    border-radius: 20px;
    border: 4px solid ${ colors.orange };
    max-width: 500px;
`

const CtnHead = styled.h2`
    padding: .5em;
    color: ${ colors.darkGrey };
`

const LoginFormS = styled.form`
    display: flex;
    flex-direction: column;
    padding: 10% 10%;
    padding-top: 0px;
`

const LabelS = styled.label`
    font-size: 20px;
    font-weight: 500;
`

const TextInput = styled.input`
    border: 2px solid ${ colors.darkGrey };
    border-radius: 20px;
    height: 30px;
    font-size: 20px;
    padding: 1px 10px;
`

const InputFieldS = styled.div`
    margin-bottom: 1em;
    display: flex;
    justify-content: center;
    flex-direction: column;
`

const SubmitS = styled.button`
    display: flex;
    padding: 5px 1px;
    margin-top: 5px;
    width: 100%;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border: 2px solid ${ colors.darkGrey };
    color: ${ colors.darkGrey };
    border-radius: 20px;
    outline: none;
    transition: transform .5s ease;

    &:hover {
        transform: scale(.9);
    }
`

const ErrorTxtS = styled.p`
    font-size: 20;
    color: red;
`

interface LoginValuesI extends ValuesI{
    'username': string
    'password': string
}

const Login = () => {
    const [ errorTxt, setErrorTxt ] = useState<string>('')
    const { global, setGlobal } = useGlobalContext()
    const nav = useNavigate()

    //when user logs in
    const submit = async (values: LoginValuesI) => {
        await axios.post<GlobalI['token']>('/cleanerPro/login', values)
            .then(res => {
                setGlobal({ ...global, token: res.data })
                nav('/')
            })
            .catch(e => {
                if(e.response.status === 401) {
                    setErrorTxt(
                        'Wrong username or password.'
                    )
                }
            })
    }

    const { 
        values, 
        handleChange,
        errors,
        handleSubmit
    } = InputsHook<LoginValuesI>(
        {
            username: '',
            password: ''
        }, 
        () => submit(values)
    )

    return(
        <LoginS>
            <LogoS>
                <LogoTxtS>Dryve 4 Cleaners</LogoTxtS>
            </LogoS>
            <LoginContainer>
                <CtnHead>LOGIN</CtnHead>
                <ErrorTxtS>{ errorTxt && errorTxt }</ErrorTxtS>
                <LoginFormS>
                    <InputFieldS>
                        <LabelS>Username</LabelS>
                        <TextInput 
                            name='username'
                            type='text'
                            onChange={e => handleChange('username', e.target.value)}
                            value={ values.username }
                        />
                        <p>{ errors?.username }</p>
                    </InputFieldS>
                    <InputFieldS>
                        <LabelS>Password</LabelS>
                        <TextInput 
                            name='password'
                            type='password'
                            onChange={e => handleChange('password', e.target.value)}
                            value={ values.password }
                        />
                        <p>{ errors?.password }</p>
                    </InputFieldS>
                    <SubmitS
                        onClick={ (e: any) => handleSubmit(e) }
                    >
                        SUBMIT
                    </SubmitS>
                </LoginFormS>
            </LoginContainer>
        </LoginS>
    )
}

export default Login