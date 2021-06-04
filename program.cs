using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ChatViaUDP
{
    class Program
    {
        private static int localPort;
        private static int remotePort;
        private static IPAddress remoteIp;
        private static string userName;
        private static Guid Id;
        private static Dictionary<Guid, List<string>> history = new Dictionary<Guid, List<string>>();

        static void Main(string[] args)
        {
            Console.WriteLine("Enter local port:");
            localPort = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Enter remote ip:");
            remoteIp = IPAddress.Parse(Console.ReadLine() ?? string.Empty);
            Console.WriteLine("Enter remote port:");
            remotePort = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Enter your username:");
            userName = Console.ReadLine();
            Id = Guid.NewGuid();
            SendMessage($"connected~{Id}", true);
            history.Add(Id, new List<string>());

            var listenThread = new Thread(ListenMessage);
            listenThread.Start();

            while (true)
            {
                Console.Write(userName + ": ");
                SendMessage($"{Id.ToString()}~" + userName + ": " + Console.ReadLine());
            }
        }

        private static void SendMessage(string message, bool isConnecting = false)
        {
            var sender = new UdpClient();
            var endPoint = new IPEndPoint(remoteIp, remotePort);

            try
            {
                var bytes = Encoding.UTF8.GetBytes(message);
                sender.Send(bytes, bytes.Length, endPoint);
                var historyValue = message.Split("~")[1];
                if (!isConnecting)
                {
                    history[Id].Add(historyValue);
                }
                
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            finally
            {
                sender.Close();
            }
        }

        private static void ListenMessage()
        {
            var listener = new UdpClient(localPort);
            IPEndPoint remoteIpEndPoint = null;
            try
            {
                while (true)
                {
                    var receiveBytes = listener.Receive(ref remoteIpEndPoint);
                    var message = Encoding.UTF8.GetString(receiveBytes);
                    var messages = message.Split('~');
                    if (messages[0] == "connected")
                    {
                        CheckConnection(message);
                    }
                    else
                    {
                        Console.WriteLine(message);
                        var tempId = new Guid(messages[0]);
                        if (history.ContainsKey(tempId))
                        {
                            history[tempId].Add(messages[1]);
                        }
                        else
                        {
                            history.Add(tempId, new List<string>() {messages[1]});
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        private static void CheckConnection(string message)
        {
            var items = message.Split("~");

            foreach (var pair in history.Where(p => p.Key == new Guid(items[1])))
            {
                foreach (var msg in pair.Value)
                {
                    SendMessage(msg);
                }
            }
        }
    }
}